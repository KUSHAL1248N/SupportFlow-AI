@echo off
setlocal
cd /d "%~dp0"
if not exist "server\.env" (
  copy "server\.env.example" "server\.env" >nul
  echo Created server\.env from example. Add GEMINI_API_KEY and replace JWT_SECRET before using AI or production settings.
)
docker compose up --build
