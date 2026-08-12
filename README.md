# AI Resume Builder

## Overview

AI Resume Builder is an AI-powered resume/CV builder that helps users create professional, recruiter-friendly resumes with support for resume preview, export, and resume management. The application combines a React/Vite frontend with a FastAPI backend and uses SQLite for persistent storage.

## Features

- AI Resume Builder interface for creating and editing resumes
- ATS-Friendly Resume design and ATS-related insights
- AI Resume Rewrite for summary and experience text
- Resume Summary Generation
- Resume Saving and editing
- My Resumes page with saved resume listing
- Resume Preview and PDF export
- Resume sections for Experience, Education, Skills, Languages, References, and Achievements
- Responsive Dashboard and Settings pages

## Dashboard

The Dashboard provides a quick overview of the user account and shows the following cards:

- Total Resumes
- ATS Friendly
- Profile Completion

The lower dashboard area includes the existing activity and resume health sections.

## AI Features

The application supports AI-powered text improvements via backend endpoints. Current AI features include:

- Rewrite existing summary text
- Improve resume / bullet text
- Improve skills formatting
- Generate a concise resume summary
- Generate a cover letter
- Generate a LinkedIn about section
- Analyze resume text for ATS score suggestions

The backend AI behavior is implemented in `backend/app/services.py` using application logic that formats and improves the provided text.

## Resume Sections

The resume builder supports the following sections in the preview and data model:

- Professional Summary
- Education
- Experience
- Skills
- Languages
- References
- Achievements
- Projects
- Personal contact information

## ATS-Friendly Resume

The app includes an ATS-friendly resume template and an interview page that analyzes pasted resume or summary text to return an ATS score and suggestions.

## My Resumes

Saved resumes appear in the `My Resumes` section. Resume data is:

- stored locally in `localStorage` for drafts and saved resumes
- attempted to be persisted to the backend when available
- displayed with resume title, saved timestamp, and action buttons
- editable via the builder by loading the saved resume
- deletable individually from the saved resume list

## Technology Stack

- Frontend: React, Vite, React Router, Tailwind-style utility classes
- Backend: FastAPI, SQLAlchemy, SQLite, Uvicorn
- AI/ML: custom text transformation and resume scoring logic in backend services
- Database/storage: SQLite database at `backend/app.db`, localStorage persistence in frontend
- Styling: Tailwind-like CSS utility classes and Vite asset pipeline
- Build tools: Vite, npm, ESLint, Prettier

## Project Structure

```text
AI_Professional_cv builder/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── services.py
│   ├── app.db
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── README.md
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/
│   │   │   ├── CVForm.jsx
│   │   │   ├── CVPreview.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── AIButton.jsx
│   │   │   ├── EducationSection.jsx
│   │   │   ├── ExperienceSection.jsx
│   │   │   ├── SkillsSection.jsx
│   │   │   ├── LanguagesSection.jsx
│   │   │   ├── ReferencesSection.jsx
│   │   │   ├── AchievementsSection.jsx
│   │   │   ├── SummarySection.jsx
│   │   │   ├── TemplateCard.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── builder.jsx
│   │   │   ├── MyResumes.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Interview.jsx
│   │   │   ├── CoverLetter.jsx
│   │   │   ├── LinkedIn.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Templates.jsx
│   │   │   └── Admin.jsx
│   │   └── services/
│   │       └── api.js
│   └── postcss.config.cjs
├── start_app.py
├── start_backend.bat
├── start_frontend.bat
├── package-lock.json
└── .venv/
```

## Installation

### 1. Clone the project

```bash
git clone <repository-url>
cd "AI_Professional_cv builder"
```

### 2. Backend setup

```bash
cd backend
```

### 3. Create a virtual environment (recommended)

```bash
python -m venv .venv
```

### 4. Activate the virtual environment (Windows)

```cmd
.venv\Scripts\activate
```

### 5. Install backend dependencies

Install the required packages manually since this repo does not include a requirements file:

```bash
python -m pip install fastapi uvicorn sqlalchemy python-jose passlib[bcrypt] pydantic
```

### 6. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 7. Start the backend

```bash
cd ../backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### 8. Start the frontend

```bash
cd ../frontend
npm run dev
```

### 9. Open the application

Open the frontend in a browser at:

```text
http://127.0.0.1:5173
```

If using the root start script, run:

```bash
python start_app.py
```

## Environment Variables

The frontend uses `VITE_API_URL` to point to the backend API when building or running the app.

Create a `.env` file in the `frontend` folder if you need to override the backend URL:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

The backend currently uses a development secret key in `backend/app/auth.py` and does not require a `.env` file out of the box.

## API

### Authentication

- `POST /api/auth/signup` — register a new user
- `POST /api/auth/login` — authenticate user
- `POST /api/auth/register` — alias for signup
- `POST /api/auth/logout` — logout endpoint (requires bearer token)
- `GET /api/auth/me` — get authenticated user profile

### Resume management

- `POST /api/resume/create` — create a resume
- `GET /api/resumes` — list user resumes
- `GET /api/resume/{resume_id}` — fetch resume details
- `PUT /api/resume/update/{resume_id}` — update resume
- `DELETE /api/resume/{resume_id}` — delete resume
- `GET /api/dashboard` — dashboard stats and resume count

### AI and resume tools

- `POST /api/ai/improve` — improve resume text
- `POST /api/ai/improve-skills` — improve skills list
- `POST /api/ai/rewrite` — rewrite resume text
- `POST /api/ai/rewrite-summary` — rewrite summary text
- `POST /api/ai/rewrite-experience` — rewrite experience bullet text
- `POST /api/ai/summary` — generate a resume summary
- `POST /api/ai/cover-letter` — generate a cover letter
- `POST /api/ai/linkedin` — generate LinkedIn about text

### ATS analysis

- `POST /api/ats/analyze` — analyze text and return an ATS score with suggestions

## Usage

A normal workflow in the app includes:

1. Sign in or register
2. Open the Dashboard for a summary of your account
3. Create a new resume in the Builder
4. Fill in personal details, experience, education, skills, languages, references, and achievements
5. Use AI features to improve summary or experience wording
6. Preview the resume and export it as PDF or DOCX
7. Save the resume locally and optionally persist it to the backend
8. View saved resumes in `My Resumes`
9. Edit or delete saved resumes from the resume list

## Resume Data

Resume drafts and saved resume metadata are stored locally in the browser using `localStorage`.

When the app is authenticated, it also attempts to persist resume data to the backend SQLite database in `backend/app.db`.

## Deployment

The project can be deployed as a split frontend/backend application:

- Frontend: build the React app with Vite and optionally serve the output from `backend/static`
- Backend: run the FastAPI server with Uvicorn
- Database: SQLite file is stored at `backend/app.db`

For local deployment, the built frontend assets are placed in `backend/static` and served by the FastAPI app.

## Troubleshooting

- **Backend not running**: ensure `uvicorn` is installed and run `python -m uvicorn app.main:app --host 127.0.0.1 --port 8000` from the `backend` folder.
- **Frontend cannot connect to backend**: confirm `VITE_API_URL` is set correctly or use Vite proxy via `vite.config.js`.
- **API errors**: check backend server logs and verify the authorization token is present in `localStorage`.
- **Missing environment variables**: the project uses `VITE_API_URL` for frontend API configuration.
- **Dependency installation issues**: install frontend dependencies with `npm install` in `frontend`, backend dependencies with `python -m pip install fastapi uvicorn sqlalchemy python-jose passlib[bcrypt] pydantic`.
- **Build errors**: verify the frontend build output path and backend static folder permissions.

## Future Improvements

- Add a dedicated backend requirements file and environment variable configuration
- Add real AI model integration instead of placeholder text transformation logic
- Improve settings persistence and profile management
- Add resume search and filtering in `My Resumes`
- Add authenticated user session handling and refresh tokens

## Author

Farzeen Fatima

## License

This repository does not currently include a license file. Add a license later if needed.
