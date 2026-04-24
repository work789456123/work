import logging
import asyncio
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from app.api.router import api_router
from app.core.config import settings
from app.db.session import engine
from app.api import product

# Basic logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title=settings.PROJECT_NAME, redirect_slashes=False)

# Debug middleware to log all incoming requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url.path}")
    response = await call_next(request)
    return response

# --- Configure CORS Middleware ---
# MUST be added before including routers to ensure preflight requests are handled
raw_origins = settings.CORS_ORIGINS.split(",") if settings.CORS_ORIGINS else []
# Clean up whitespace and expand common variations if not present
base_origins = [o.strip() for o in raw_origins if o.strip() and o.strip() != "*"]
origins = list(set(base_origins + [
    "https://pashuvaani.com",
    "https://www.pashuvaani.com",
    "https://dev.pashuvaani.com"
]))

logger.info(f"Configured CORS origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Static Files & Routers ---
uploads_dir = Path("uploads")
uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

app.include_router(product.router, prefix="/products", tags=["Products"])
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Welcome to PashuVaani API Backend",
        "doc_url": "/docs"
    }

@app.get("/health/db")
async def db_health():
    try:
        async with engine.connect() as conn:
            # Keep this bounded so ALB can quickly mark bad targets unhealthy.
            await asyncio.wait_for(conn.execute(text("SELECT 1")), timeout=3)
        return {"status": "ok"}
    except Exception as exc:
        logger.exception("Database health check failed: %s", exc)
        return JSONResponse(status_code=503, content={"status": "degraded", "reason": "database_unreachable"})

@app.on_event("shutdown")
async def shutdown_db_client():
    await engine.dispose()
