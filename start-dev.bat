@echo off
REM Development startup script for Echoes of History (Windows)

echo 🏛️  Starting Echoes of History Development Environment
echo ==================================================

REM Check if virtual environment exists
if not exist ".venv" (
    echo ❌ Virtual environment not found. Creating one...
    python -m venv .venv
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call .venv\Scripts\activate.bat

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
pip install -r requirements.txt

REM Start backend server in background
echo 🚀 Starting backend server on http://127.0.0.1:8080
start "Backend Server" cmd /c "uvicorn app.main:app --reload --host 127.0.0.1 --port 8080"

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install

REM Start frontend server
echo 🚀 Starting frontend server on http://localhost:3000
echo ✅ Both servers are starting...
echo Backend: http://127.0.0.1:8080
echo Frontend: http://localhost:3000
echo Press Ctrl+C to stop the frontend server
call npm run dev
