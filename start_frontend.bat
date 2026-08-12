@echo off
cd /d "%~dp0frontend"
if exist node_modules (
    npm run dev
) else (
    npm install
    npm run dev
)
