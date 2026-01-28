@echo off
echo ============================================================
echo   Clinical Component Identifier - Setup
echo ============================================================
echo.

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found! Install from https://python.org
    echo         Make sure to check "Add Python to PATH"
    pause
    exit /b 1
)
echo [OK] Python found

REM Check Node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! Install from https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js found
echo.

REM Setup Backend
echo Setting up backend...
cd /d "%~dp0backend"
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet
echo [OK] Backend ready
echo.

REM Setup Frontend
echo Setting up frontend...
cd /d "%~dp0frontend"
call npm install --silent
echo [OK] Frontend ready
echo.

echo ============================================================
echo   SETUP COMPLETE!
echo ============================================================
echo.
echo NEXT STEPS:
echo   1. Edit backend\app.py and add your OpenAI API key on line 35
echo   2. Run START.bat to launch the application
echo.
pause
