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

# --- Configure CORS Middleware ---
raw_origins = settings.CORS_ORIGINS.split(",") if settings.CORS_ORIGINS else []
base_origins = [o.strip() for o in raw_origins if o.strip()]

if "*" in base_origins:
    origins = ["*"]
else:
    origins = list(set(base_origins + [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "https://pashuvaani.com",
        "https://www.pashuvaani.com",
        "https://dev.pashuvaani.com"
    ]))

logger.info(f"Configured CORS origins: {origins}")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    try:
        logger.info(f"Incoming request: {request.method} {request.url.path}")
        response = await call_next(request)
        return response
    except Exception as e:
        logger.error(f"Error processing request {request.method} {request.url.path}: {e}")
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal Server Error: {str(e)}"}
        )

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True if "*" not in origins else False,
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
            await asyncio.wait_for(conn.execute(text("SELECT 1")), timeout=3)
        return {"status": "ok"}
    except Exception as exc:
        logger.exception("Database health check failed: %s", exc)
        return JSONResponse(status_code=503, content={"status": "degraded", "reason": "database_unreachable"})

@app.on_event("shutdown")
async def shutdown_db_client():
    await engine.dispose()
