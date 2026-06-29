@echo off
echo Stopping Legal Crime Identifier...

:: Terminate any running Node.js processes directly (frontend and backend dev servers)
taskkill /F /IM node.exe 2>nul

:: Terminate backend server on port 5000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    taskkill /F /T /PID %%a 2>nul
)

:: Terminate frontend client on port 5173
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    taskkill /F /T /PID %%a 2>nul
)

:: Terminate any remaining command prompt windows matching the titles we opened
taskkill /F /T /FI "WINDOWTITLE eq Crime Identifier - Server" 2>nul
taskkill /F /T /FI "WINDOWTITLE eq Crime Identifier - Client" 2>nul

echo All processes terminated successfully!
