@echo off
echo.
echo ========================================
echo   SwiftBet Mock Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Error: npm install failed!
        pause
        exit /b 1
    )
    echo.
)

echo Starting server on http://localhost:3001
echo.
echo Available endpoints:
echo   - GET  http://localhost:3001/health
echo   - GET  http://localhost:3001/api-v2/today-sport-types/m/1/trader123
echo   - GET  http://localhost:3001/api-v2/left-menu/m/1/trader123
echo   - GET  http://localhost:3001/api-v2/upcoming-events/m/1/trader123
echo   - POST http://localhost:3001/api/user/sportsBet/info
echo.
echo Test endpoints at: http://localhost:3001/test.html
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start
pause
