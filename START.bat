@echo off
echo ============================================================
echo   Clinical Component Identifier - Starting...
echo ============================================================
echo.

REM Start Backend in new window
echo Starting backend on http://localhost:5000 ...
start "Backend" cmd /k "cd /d "%~dp0backend" && call venv\Scripts\activate.bat && python app.py"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend in new window  
echo Starting frontend on http://localhost:3000 ...
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ============================================================
echo   Application Started!
echo ============================================================
echo.
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000  (opens automatically)
echo.
echo   Close both command windows to stop the application.
echo.
pause
