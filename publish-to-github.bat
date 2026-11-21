@echo off
setlocal
cd /d "%~dp0"
echo Publishing SupportFlow AI to your GitHub repository.
where git >nul 2>nul
if errorlevel 1 (
  echo Git was not found. Install Git for Windows first.
  pause
  exit /b 1
)
set /p GH_USERNAME=Enter your GitHub username: 
set /p GH_REPO=Enter the empty GitHub repository name (default SupportFlow-AI): 
if "%GH_REPO%"=="" set GH_REPO=SupportFlow-AI
if "%GH_USERNAME%"=="" (echo Username is required.& pause & exit /b 1)
git init
if errorlevel 1 goto failed
git add .
git status
echo Review the list above. Do not continue if any .env file or API key is listed.
set /p CONFIRM=Type YES to commit and push: 
if /I not "%CONFIRM%"=="YES" goto cancelled
git commit -m "Initial commit: SupportFlow AI"
if errorlevel 1 goto failed
git branch -M main
git remote add origin https://github.com/%GH_USERNAME%/%GH_REPO%.git
if errorlevel 1 goto failed
git push -u origin main
if errorlevel 1 goto failed
echo Published successfully.
pause
exit /b 0
:cancelled
echo Cancelled before commit.
pause
exit /b 0
:failed
echo A Git command failed. Read the message above and follow PUBLISH_TO_GITHUB.md.
pause
exit /b 1
