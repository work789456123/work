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
    # 1. Run Alembic migrations (idempotent — stamps to head if tables already exist)
    if not settings.SKIP_ALEMBIC_AT_STARTUP:
        logger.info("Applying database migrations (alembic upgrade head)...")
        try:
            await asyncio.to_thread(_run_alembic_upgrade_head)
            logger.info("Database migrations are up to date.")
        except Exception as exc:
            logger.warning(
                "Alembic migration failed (tables may already exist): %s. "
                "Stamping database to head and continuing.",
                exc,
            )
            try:
                def _stamp_head() -> None:
                    root = Path(__file__).resolve().parents[1]
                    ini = root / "alembic.ini"
                    cfg = Config(str(ini))
                    command.stamp(cfg, "head")
                await asyncio.to_thread(_stamp_head)
                logger.info("Database stamped to head successfully.")
            except Exception as stamp_exc:
                logger.error("Failed to stamp database: %s", stamp_exc)
    else:
        logger.info("SKIP_ALEMBIC_AT_STARTUP is set; skipping Alembic on startup.")

    # 2. Seed initial data (admin user, sample blogs/doctors) — safe to run on every start (idempotent)
    try:
        from app.db.init_db import init_db as _seed_db
        await _seed_db()
        logger.info("Database seeding complete.")
    except Exception as seed_exc:
        logger.error("Database seeding failed (non-fatal): %s", seed_exc)

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

