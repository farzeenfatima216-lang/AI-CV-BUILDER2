@echo off
cd /d "%~dp0"
echo Building frontend for production...
cd frontend
if not exist node_modules (
  echo Installing frontend dependencies...
  npm install
)
set "API_URL=http://127.0.0.1:8000"
set "VITE_API_URL=%API_URL%/api"
set "APP_URL=%API_URL%/login"
echo Using frontend URL: %API_URL%
echo Using app URL: %APP_URL%
echo Building frontend using API URL: %VITE_API_URL%
npm run build
cd ..
echo Starting backend on %API_URL%
cd backend
if exist .venv\Scripts\python.exe (
    .venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
) else (
    python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
)
