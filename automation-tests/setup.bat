@echo off
echo ========================================
echo  MilkMan Automation Tests - Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

REM Check if .env exists
if exist .env (
    echo [INFO] .env file already exists
    echo.
) else (
    echo [INFO] Creating .env file from template...
    copy .env.example .env >nul
    echo [OK] .env file created
    echo.
)

REM Install dependencies
echo [INFO] Installing dependencies...
echo This may take a few minutes...
echo.
call npm install

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Ensure MilkMan application is running:
echo      docker-compose up -d
echo.
echo   2. Run tests:
echo      npm test              (All tests)
echo      npm run test:api      (API tests only)
echo      npm run test:ui       (UI tests only)
echo.
echo   3. View reports:
echo      npm run report
echo.
echo For more information, see README.md or QUICKSTART.md
echo.
pause
