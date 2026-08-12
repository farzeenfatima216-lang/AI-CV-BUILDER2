import json
import logging
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr, constr
from sqlalchemy import func, text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session
from . import models
from .database import engine, get_db
from .auth import get_current_user, create_access_token, get_password_hash, verify_password
from .services import (
    improve_resume_text,
    generate_cover_letter,
    generate_linkedin_about,
    generate_resume_summary,
    rewrite_experience,
    score_resume,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("resume-builder")


def ensure_resume_schema():
    with engine.begin() as connection:
        result = connection.execute(text("PRAGMA table_info(resumes)"))
        existing_columns = {row[1] for row in result}
        columns_to_add = [
            ("title", "TEXT"),
            ("selected_template", "TEXT"),
            ("summary", "TEXT"),
            ("languages", "TEXT"),
            ("achievements", "TEXT"),
            ("references", "TEXT"),
            ("updated_at", "DATETIME"),
        ]
        for name, definition in columns_to_add:
            if name not in existing_columns:
                connection.execute(text(f'ALTER TABLE resumes ADD COLUMN "{name}" {definition}'))


API_PREFIX = "/api"
STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="AI Resume Builder API",
    version="1.0.0",
    openapi_url=f"{API_PREFIX}/openapi.json",
    docs_url=f"{API_PREFIX}/docs",
    redoc_url=f"{API_PREFIX}/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    logger.info("Initializing database schema")
    models.Base.metadata.create_all(bind=engine)
    ensure_resume_schema()
    logger.info("Database initialization complete")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info("Incoming request %s %s", request.method, request.url.path)
    try:
        response = await call_next(request)
        logger.info("Response %s %s -> %s", request.method, request.url.path, response.status_code)
        return response
    except Exception as exc:
        logger.exception("Unhandled exception processing %s %s", request.method, request.url.path)
        raise


class SignupRequest(BaseModel):
    name: constr(strip_whitespace=True, min_length=1, max_length=100)
    email: EmailStr
    password: constr(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: constr(min_length=1, max_length=128)


class ResumeCreateRequest(BaseModel):
    personal_information: dict
    education: list
    experience: list
    skills: dict
    projects: list
    certifications: list


class ResumeUpdateRequest(BaseModel):
    personal_information: Optional[dict] = None
    education: Optional[list] = None
    experience: Optional[list] = None
    skills: Optional[dict] = None
    projects: Optional[list] = None
    certifications: Optional[list] = None


@app.get(f"{API_PREFIX}")
def api_root():
    return {"message": "AI Resume Builder API is running", "status": "ok"}


@app.get(f"{API_PREFIX}/health")
def health():
    return {"message": "AI Resume Builder API is running"}


@app.post(f"{API_PREFIX}/auth/signup")
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    normalized_email = str(payload.email).strip().lower()
    normalized_name = str(payload.name).strip()
    logger.info("Signup request received for email=%s name=%s", normalized_email, normalized_name)

    existing = db.query(models.User).filter(func.lower(models.User.email) == normalized_email).first()
    if existing:
        logger.warning("Signup failed: email already registered: %s", normalized_email)
        raise HTTPException(status_code=409, detail="Email already registered")
    try:
        password_hash = get_password_hash(payload.password)
    except ValueError as ve:
        logger.warning("Invalid signup payload for email=%s: %s", normalized_email, ve)
        raise HTTPException(status_code=400, detail=str(ve))

    user = models.User(
        name=normalized_name,
        email=normalized_email,
        password_hash=password_hash,
    )
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        token = create_access_token({"sub": user.email})
        logger.info("Signup successful for email=%s id=%s", user.email, user.id)
        return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "name": user.name, "email": user.email}}
    except IntegrityError as integrity_error:
        db.rollback()
        logger.warning("Signup integrity error for email=%s: %s", normalized_email, integrity_error)
        raise HTTPException(status_code=409, detail="Email already registered")
    except SQLAlchemyError:
        db.rollback()
        logger.exception("Database error during signup for email=%s", normalized_email)
        raise HTTPException(status_code=500, detail="Internal server error")
    except Exception:
        db.rollback()
        logger.exception("Unexpected error during signup for email=%s", normalized_email)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post(f"{API_PREFIX}/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    normalized_email = str(payload.email).strip().lower()
    logger.info("Login request received for email=%s", normalized_email)

    try:
        user = db.query(models.User).filter(func.lower(models.User.email) == normalized_email).first()
        if not user:
            logger.warning("Login failed: user not found for email=%s", normalized_email)
            raise HTTPException(status_code=401, detail="Invalid credentials")

        password_valid = verify_password(payload.password, user.password_hash)
        logger.info("Password verification result for email=%s: %s", normalized_email, password_valid)
        if not password_valid:
            logger.warning("Login failed: invalid password for email=%s", normalized_email)
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = create_access_token({"sub": user.email})
        logger.info("Login successful for email=%s id=%s", user.email, user.id)
        return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "name": user.name, "email": user.email}}
    except HTTPException:
        raise
    except SQLAlchemyError:
        logger.exception("Database error during login for email=%s", normalized_email)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post(f"{API_PREFIX}/auth/register")
def register_alias(payload: SignupRequest, db: Session = Depends(get_db)):
    """Alias for /api/auth/signup to support clients using /register path."""
    return signup(payload, db)


@app.post("/auth/signup")
def signup_root(payload: SignupRequest, db: Session = Depends(get_db)):
    return signup(payload, db)


@app.post("/auth/login")
def login_root(payload: LoginRequest, db: Session = Depends(get_db)):
    return login(payload, db)


@app.post(f"{API_PREFIX}/auth/logout")
def logout(current_user=Depends(get_current_user)):
    return {"message": "Logged out successfully"}


@app.get(f"{API_PREFIX}/auth/me")
def profile(current_user=Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email}


def serialize_resume(resume: models.Resume) -> dict:
    return {
        "id": resume.id,
        "title": resume.title,
        "selected_template": resume.selected_template,
        "personal_information": json.loads(resume.personal_information or '{}'),
        "summary": resume.summary or "",
        "education": json.loads(resume.education or '[]'),
        "experience": json.loads(resume.experience or '[]'),
        "skills": json.loads(resume.skills or '{}'),
        "projects": json.loads(resume.projects or '[]'),
        "certifications": json.loads(resume.certifications or '[]'),
        "languages": json.loads(resume.languages or '[]'),
        "achievements": json.loads(resume.achievements or '[]'),
        "references": json.loads(resume.references or '[]'),
        "created_at": resume.created_at.isoformat() if resume.created_at else None,
        "updated_at": resume.updated_at.isoformat() if resume.updated_at else None,
    }


def ai_success_response(result: str = "", **kwargs):
    response = {"success": True, "result": result}
    response.update(kwargs)
    return response


def ai_error_response(message: str, status_code: int = 200):
    logger.warning("AI error response: %s", message)
    return JSONResponse(status_code=status_code, content={"success": False, "message": message})


def get_payload_text(payload: dict) -> str:
    if not isinstance(payload, dict):
        logger.warning("AI endpoint received invalid payload type: %s", type(payload).__name__)
        return ""
    text = payload.get("text", "")
    if text is None:
        return ""
    if not isinstance(text, str):
        try:
            text = str(text)
        except Exception:
            logger.exception("Failed to coerce AI payload text to string")
            return ""
    return text.strip()


@app.post(f"{API_PREFIX}/resume/create")
def create_resume(payload: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    try:
        resume = models.Resume(
            user_id=current_user.id,
            title=payload.get("title") or payload.get("personal_information", {}).get("name"),
            selected_template=payload.get("selected_template", "modern"),
            personal_information=json.dumps(payload.get("personal_information", {})),
            summary=payload.get("summary", ""),
            education=json.dumps(payload.get("education", [])),
            experience=json.dumps(payload.get("experience", [])),
            skills=json.dumps(payload.get("skills", {})),
            projects=json.dumps(payload.get("projects", [])),
            certifications=json.dumps(payload.get("certifications", [])),
            languages=json.dumps(payload.get("languages", [])),
            achievements=json.dumps(payload.get("achievements", [])),
            references=json.dumps(payload.get("references", [])),
        )
        db.add(resume)
        db.commit()
        db.refresh(resume)
        return {"message": "Resume created", "resume": serialize_resume(resume)}
    except SQLAlchemyError:
        db.rollback()
        logger.exception("Database error while creating resume for user id=%s", current_user.id)
        raise HTTPException(status_code=500, detail="Unable to save resume.")
    except Exception:
        db.rollback()
        logger.exception("Unexpected error while creating resume for user id=%s", current_user.id)
        raise HTTPException(status_code=500, detail="Unable to save resume.")


@app.get(f"{API_PREFIX}/resumes")
def list_resumes(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    resumes = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).order_by(models.Resume.updated_at.desc()).all()
    return {"resumes": [serialize_resume(resume) for resume in resumes]}


@app.get(f"{API_PREFIX}/resume/{{resume_id}}")
def get_resume(resume_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id, models.Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {
        "id": resume.id,
        "personal_information": json.loads(resume.personal_information or '{}'),
        "education": json.loads(resume.education or '[]'),
        "experience": json.loads(resume.experience or '[]'),
        "skills": json.loads(resume.skills or '{}'),
        "projects": json.loads(resume.projects or '[]'),
        "certifications": json.loads(resume.certifications or '[]'),
    }


@app.put(f"{API_PREFIX}/resume/update/{{resume_id}}")
def update_resume(resume_id: int, payload: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id, models.Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    try:
        if "title" in payload:
            resume.title = payload["title"]
        if "selected_template" in payload:
            resume.selected_template = payload["selected_template"]
        if "personal_information" in payload:
            resume.personal_information = json.dumps(payload["personal_information"])
        if "summary" in payload:
            resume.summary = payload["summary"]
        if "education" in payload:
            resume.education = json.dumps(payload["education"])
        if "experience" in payload:
            resume.experience = json.dumps(payload["experience"])
        if "skills" in payload:
            resume.skills = json.dumps(payload["skills"])
        if "projects" in payload:
            resume.projects = json.dumps(payload["projects"])
        if "certifications" in payload:
            resume.certifications = json.dumps(payload["certifications"])
        if "languages" in payload:
            resume.languages = json.dumps(payload["languages"])
        if "achievements" in payload:
            resume.achievements = json.dumps(payload["achievements"])
        if "references" in payload:
            resume.references = json.dumps(payload["references"])

        db.commit()
        return {"message": "Resume updated", "resume": serialize_resume(resume)}
    except SQLAlchemyError:
        db.rollback()
        logger.exception("Database error while updating resume id=%s for user id=%s", resume_id, current_user.id)
        raise HTTPException(status_code=500, detail="Unable to update resume.")
    except Exception:
        db.rollback()
        logger.exception("Unexpected error while updating resume id=%s for user id=%s", resume_id, current_user.id)
        raise HTTPException(status_code=500, detail="Unable to update resume.")


@app.delete(f"{API_PREFIX}/resume/{{resume_id}}")
def delete_resume(resume_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id, models.Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    try:
        db.delete(resume)
        db.commit()
        return {"message": "Resume deleted"}
    except SQLAlchemyError:
        db.rollback()
        logger.exception("Database error while deleting resume id=%s for user id=%s", resume_id, current_user.id)
        raise HTTPException(status_code=500, detail="Unable to delete resume.")


@app.get(f"{API_PREFIX}/dashboard")
def dashboard(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    resume_list = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).order_by(models.Resume.updated_at.desc()).all()
    documents = db.query(models.GeneratedDocument).filter(models.GeneratedDocument.user_id == current_user.id).count()
    return {
        "user": current_user.name,
        "resumes": len(resume_list),
        "documents": documents,
        "resume_list": [
            {
                "id": resume.id,
                "title": resume.title or resume.personal_information,
                "selected_template": resume.selected_template,
                "updated_at": resume.updated_at.isoformat() if resume.updated_at else None,
            }
            for resume in resume_list
        ],
    }


@app.post(f"{API_PREFIX}/ai/improve")
def improve(payload: dict):
    logger.info("AI improve called with payload=%s", payload)
    try:
        text = get_payload_text(payload)
        improved_text = text
        if payload.get("purpose") == "improve_skills":
            skills = [skill.strip().title() for skill in text.split(",") if skill.strip()]
            improved_text = ", ".join(skills) if skills else improve_resume_text(text)
        else:
            improved_text = improve_resume_text(text)

        response = {
            "success": True,
            "improved_text": improved_text,
            "result": improved_text,
        }
        if payload.get("purpose") == "rewrite_summary":
            response["summary"] = improved_text
        logger.info("AI improve response=%s", response)
        return response
    except Exception as exc:
        logger.exception("AI improve failed: %s", exc)
        return ai_error_response("Unable to improve the provided text.")


@app.post(f"{API_PREFIX}/ai/improve-skills")
def improve_skills_alias(payload: dict):
    payload["purpose"] = "improve_skills"
    return improve(payload)


@app.post(f"{API_PREFIX}/ai/rewrite-summary")
def rewrite_summary_alias(payload: dict):
    payload["purpose"] = "rewrite_summary"
    return rewrite_text(payload)


@app.post(f"{API_PREFIX}/ai/rewrite")
def rewrite_text(payload: dict):
    logger.info("AI rewrite called with payload=%s", payload)
    try:
        text = get_payload_text(payload)
        improved_text = improve_resume_text(text)
        response = {
            "success": True,
            "summary": improved_text,
            "improved_text": improved_text,
            "result": improved_text,
        }
        logger.info("AI rewrite response=%s", response)
        return response
    except Exception as exc:
        logger.exception("AI rewrite failed: %s", exc)
        return ai_error_response("Unable to rewrite the provided text.")


@app.post(f"{API_PREFIX}/ai/experience-rewrite")
def rewrite_experience_endpoint(payload: dict):
    logger.info("AI experience rewrite called with payload=%s", payload)
    try:
        text = get_payload_text(payload)
        rewritten = improve_resume_text(text)
        response = {
            "success": True,
            "result": rewritten,
            "improved_text": rewritten,
        }
        logger.info("AI experience rewrite response=%s", response)
        return response
    except Exception as exc:
        logger.exception("AI experience rewrite failed: %s", exc)
        return ai_error_response("Unable to rewrite the experience section.")


@app.post(f"{API_PREFIX}/ai/rewrite-experience")
def rewrite_experience_alias(payload: dict):
    return rewrite_experience_endpoint(payload)


@app.post(f"{API_PREFIX}/ai/summary")
def summary_endpoint(payload: dict):
    """Generate a concise professional summary from provided text or resume data."""
    try:
        text = get_payload_text(payload)
        generated = generate_resume_summary(text)
        return ai_success_response(generated, summary=generated)
    except Exception as exc:
        logger.exception("Error generating summary: %s", exc)
        return ai_error_response("Unable to generate a summary.")


@app.post(f"{API_PREFIX}/ai/cover-letter")
def generate_cover_letter_endpoint(payload: dict):
    logger.info("AI cover-letter called with payload=%s", payload)
    try:
        cover_letter = generate_cover_letter(payload.get("name", "Your Name"), payload.get("role", "Professional"), payload.get("company", "Company"))
        response = ai_success_response(cover_letter, cover_letter=cover_letter)
        logger.info("AI cover-letter response=%s", response)
        return response
    except Exception as exc:
        logger.exception("Error generating cover letter: %s", exc)
        return ai_error_response("Unable to generate a cover letter.")


@app.post(f"{API_PREFIX}/ai/linkedin")
def generate_linkedin_endpoint(payload: dict):
    logger.info("AI linkedin called with payload=%s", payload)
    try:
        linkedin_about = generate_linkedin_about(payload.get("name", "Your Name"), payload.get("summary", "Professional"))
        response = ai_success_response(linkedin_about, linkedin_about=linkedin_about)
        logger.info("AI linkedin response=%s", response)
        return response
    except Exception as exc:
        logger.exception("Error generating LinkedIn summary: %s", exc)
        return ai_error_response("Unable to generate a LinkedIn summary.")


@app.post(f"{API_PREFIX}/ats/analyze")
def analyze_resume(payload: dict):
    text = get_payload_text(payload)
    score, suggestions = score_resume(text)
    return {"ats_score": score, "suggestions": suggestions}


app.mount("/static", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")


@app.get("/{full_path:path}")
def spa_router(full_path: str):
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    raise HTTPException(status_code=404, detail="Page not found")
