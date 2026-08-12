from pathlib import Path
import os
import subprocess
import sys

ROOT_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = ROOT_DIR / "frontend"
BACKEND_DIR = ROOT_DIR / "backend"

if __name__ == "__main__":
    # Build frontend
    npm_cmd = "npm"
    if sys.platform == "win32":
        npm_cmd = "npm.cmd"

    if not (FRONTEND_DIR / "node_modules").exists():
        print("Installing frontend dependencies...")
        subprocess.run([npm_cmd, "install"], cwd=str(FRONTEND_DIR), check=True)

    env = os.environ.copy()
    env["VITE_API_URL"] = "http://127.0.0.1:8000/api"
    print(f"Building frontend for production using API URL: {env['VITE_API_URL']}")
    subprocess.run([npm_cmd, "run", "build"], cwd=str(FRONTEND_DIR), check=True, env=env)

    # Start backend
    print("Starting backend on http://127.0.0.1:8000")
    python_exec = sys.executable
    if (BACKEND_DIR / ".venv" / "Scripts" / "python.exe").exists():
        python_exec = str(BACKEND_DIR / ".venv" / "Scripts" / "python.exe")

    subprocess.run(
        [python_exec, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=str(BACKEND_DIR),
        check=True,
    )
