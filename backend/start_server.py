#!/usr/bin/env python3
"""
Production server for Echoes of History API
Runs the FastAPI server in a stable manner on Windows
"""

import sys
import os
import threading
import time
import signal

# Add the backend directory to the Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

from stable_main import app
import uvicorn

def run_server():
    """Run the FastAPI server"""
    print("🚀 Starting Echoes of History API server...")
    uvicorn.run(
        app, 
        host="127.0.0.1", 
        port=8085, 
        log_level="info",
        access_log=True
    )

def main():
    """Main server entry point"""
    print("=" * 60)
    print("🏛️  ECHOES OF HISTORY - BACKEND API SERVER")
    print("=" * 60)
    print(f"📍 Server will run on: http://127.0.0.1:8085")
    print(f"📍 Health check: http://127.0.0.1:8085/healthz")
    print(f"📍 Cinematic search: http://127.0.0.1:8085/api/cinematic")
    print("=" * 60)
    
    try:
        # Start server in a separate thread for better process management
        server_thread = threading.Thread(target=run_server, daemon=False)
        server_thread.start()
        
        print("✅ Server started successfully!")
        print("🔄 Server is running... Press Ctrl+C to stop")
        
        # Keep the main thread alive
        server_thread.join()
        
    except KeyboardInterrupt:
        print("\n🛑 Received shutdown signal...")
        print("🔄 Shutting down server...")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
