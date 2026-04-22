import logging
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.router import api_router
from app.core.config import settings
from app.db.session import engine
from app.api import product

# Basic logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
# We removed redirect_slashes=False to use FastAPI's default behavior
app = FastAPI(title=settings.PROJECT_NAME)

# --- Configure CORS Middleware ---
# MUST be added before including routers to ensure preflight requests are handled
raw_origins = settings.CORS_ORIGINS.split(",") if settings.CORS_ORIGINS else ["*"]
# Clean up whitespace from each origin to prevent matching failures
origins = [o.strip() for o in raw_origins if o.strip()]

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

@app.on_event("shutdown")
async def shutdown_db_client():
    await engine.dispose()
