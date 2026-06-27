@echo off
:: Launch the backend server minimized
start /min "Crime Identifier - Server" cmd /c "cd server && npm run dev"

:: Launch the frontend client minimized
start /min "Crime Identifier - Client" cmd /c "cd client && npm run dev"

:: Wait 3 seconds for the development servers to initialize
timeout /t 3 /nobreak >nul

:: Open the website in the default web browser (Chrome)
start http://localhost:5173
