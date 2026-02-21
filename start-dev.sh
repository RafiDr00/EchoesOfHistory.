#!/bin/bash
# Development startup script for Echoes of History

echo "🏛️  Starting Echoes of History Development Environment"
echo "=================================================="

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "❌ Virtual environment not found. Creating one..."
    python -m venv .venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source .venv/bin/activate  # Unix/Linux/Mac
# For Windows: .venv\Scripts\activate

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt

# Start backend server
echo "🚀 Starting backend server on http://127.0.0.1:8080"
uvicorn app.main:app --reload --host 127.0.0.1 --port 8080 &
BACKEND_PID=$!

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Start frontend server
echo "🚀 Starting frontend server on http://localhost:3000"
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers are starting..."
echo "Backend: http://127.0.0.1:8080"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop both servers"

# Wait for interrupt signal
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
