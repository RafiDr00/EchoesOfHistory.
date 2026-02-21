from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Echoes of History - API")

@app.middleware("http")
async def catch_exceptions(request: Request, call_next):
    try:
        print(f"Received request: {request.method} {request.url}")
        response = await call_next(request)
        print(f"Sending response: {response.status_code}")
        return response
    except Exception as e:
        print(f"Unhandled exception: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"detail": "Internal server error"})

# Add CORS middleware to allow frontend connections
frontend_urls = os.getenv("FRONTEND_URL", "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
async def healthz():
    print("Health endpoint called successfully")
    return {"status": "ok", "message": "Server is running"}

@app.get("/api/test")
async def test_endpoint():
    print("Test endpoint called")
    return {"message": "Test successful", "server": "running"}

if __name__ == "__main__":
    import uvicorn
    print("Starting minimal server...")
    uvicorn.run(app, host="127.0.0.1", port=8082, log_level="info")
