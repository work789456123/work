import logging
import asyncio
from contextlib import asynccontextmanager
from pathlib import Path

from alembic import command
from alembic.config import Config
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


def _run_alembic_upgrade_head() -> None:
    """Apply bundled Alembic revisions (same as `alembic upgrade head` in the image workdir)."""
    root = Path(__file__).resolve().parents[1]
    ini = root / "alembic.ini"
    if not ini.is_file():
        raise FileNotFoundError(f"alembic.ini not found at {ini}")
    cfg = Config(str(ini))
    command.upgrade(cfg, "head")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Production-friendly for ECS image-only deploys: schema matches this process before serving traffic.
    if not settings.SKIP_ALEMBIC_AT_STARTUP:
        logger.info("Applying database migrations (alembic upgrade head)...")
        await asyncio.to_thread(_run_alembic_upgrade_head)
        logger.info("Database migrations are up to date.")
    else:
        logger.info("SKIP_ALEMBIC_AT_STARTUP is set; skipping Alembic on startup.")
    try:
        yield
    finally:
        await engine.dispose()


# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    redirect_slashes=False,
    lifespan=lifespan,
)

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

@app.on_event("startup")
async def startup_event():
    import app.db.base
    try:
        async with engine.begin() as conn:
            await conn.run_sync(app.db.base.Base.metadata.create_all)
        logger.info("Database tables verified/created successfully.")
    except Exception as e:
        logger.error(f"Error creating tables: {e}")

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

