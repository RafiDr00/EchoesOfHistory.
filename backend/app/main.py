from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api import router as v1_core_router
from app.api.enhanced_search_simple import router as v1_search_router
from app.api.cinematic_search import router as v1_cinematic_router
from app.api.suggestions import router as v1_suggestions_router
from app.db import init_db
from app.services.history_service import close_http_client
import time
import logging
import os
import traceback
from dotenv import load_dotenv

load_dotenv()

# Elite Logging Configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger("echoes")

app = FastAPI(
    title="Echoes of History API",
    description="Enterprise-grade historical archive and cinematic search engine",
    version="1.0.0"
)

# Unified API Versioning
API_V1_STR = "/api/v1"

# Performance & Observability Middleware
@app.middleware("http")
async def app_middleware(request: Request, call_next):
    start_time = time.time()
    request_id = os.urandom(4).hex()
    
    # Pre-processing
    logger.info(f"[{request_id}] START {request.method} {request.url.path}")
    
    try:
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
        response.headers["X-Request-ID"] = request_id
        
        logger.info(f"[{request_id}] END   {request.method} {request.url.path} - {response.status_code} ({process_time:.2f}ms)")
        return response
    except Exception as e:
        logger.error(f"[{request_id}] CRITICAL FAIL: {request.method} {request.url.path}")
        logger.error(traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={
                "detail": "An internal server error occurred.",
                "request_id": request_id
            }
        )

# Lifecycle Management
@app.on_event("startup")
async def startup_event():
    logger.info("Initializing Echoes of History Infrastructure...")
    try:
        await init_db()
        logger.info("Database Synchronized.")
    except Exception as e:
        logger.critical(f"Database Initialization Failed: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down infrastructure...")
    await close_http_client()
    logger.info("Historical Service connection pools closed.")

# Security: CORS
frontend_origins = os.getenv("FRONTEND_URL", "http://localhost:3000,http://localhost:3001").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route Mounting (Clean Hierarchy)
app.include_router(v1_core_router, prefix=f"{API_V1_STR}")
app.include_router(v1_search_router, prefix=f"{API_V1_STR}/search")
app.include_router(v1_cinematic_router, prefix=f"{API_V1_STR}/cinematic")
app.include_router(v1_suggestions_router, prefix=f"{API_V1_STR}/suggestions")

@app.get("/healthz", tags=["Infrastructure"])
async def health_check():
    """Liveness probe for enterprise monitoring systems"""
    return {"status": "healthy", "service": "echoes-of-history", "timestamp": time.time()}
