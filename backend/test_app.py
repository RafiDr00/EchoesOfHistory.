from fastapi import FastAPI
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Echoes of History - API")

# Removed CORS middleware for testing

@app.get("/healthz")
def healthz():
    print("Health endpoint called")
    return {"status": "ok"}

@app.on_event("shutdown")
def shutdown_event():
    print("Application is shutting down")

@app.get("/healthz")
def healthz():
    print("Health endpoint called")
    return {"status": "ok"}

@app.on_event("shutdown")
def shutdown_event():
    print("Application is shutting down")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8082)
