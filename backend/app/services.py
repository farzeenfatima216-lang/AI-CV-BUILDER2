from typing import Tuple, List


def improve_resume_text(text: str) -> str:
    if not text:
        return ""
    cleaned = text.strip()
    if cleaned.lower().startswith("made"):
        return f"Developed {cleaned[4:].strip()} with a focus on user experience, maintainability, and modern best practices."
    return f"Delivered {cleaned} with strong execution, measurable impact, and professionalism."


def generate_resume_summary(text: str) -> str:
    if not text:
        return ""
    # Reuse the same formatting logic for summary generation in this placeholder implementation.
    return improve_resume_text(text)


def rewrite_experience(text: str) -> str:
    if not text:
        return ""
    return improve_resume_text(text)


def generate_cover_letter(name: str, role: str, company: str) -> str:
    return f"Dear Hiring Team,\n\nI am excited to apply for the {role} role at {company}. With a strong foundation in building professional, user-focused solutions, I am confident I can contribute meaningfully to your team.\n\nSincerely,\n{name}"


def generate_linkedin_about(name: str, summary: str) -> str:
    return f"Hi, I’m {name}. I’m a professional focused on {summary}, building thoughtful solutions and growing in fast-paced, modern environments."


def score_resume(text: str) -> Tuple[int, List[str]]:
    score = 70
    suggestions = []
    lowered = text.lower()
    if "react" in lowered or "python" in lowered or "sql" in lowered:
        score += 10
    if len(text.split()) < 80:
        suggestions.append("Add more measurable achievements and keywords")
    if "developed" not in lowered and "built" not in lowered:
        suggestions.append("Use stronger action verbs")
    if not suggestions:
        suggestions.append("Resume looks strong—consider adding more quantified results")
    return min(score, 100), suggestions
