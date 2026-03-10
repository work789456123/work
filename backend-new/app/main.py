import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.config import settings
from app.db.session import engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title=settings.PROJECT_NAME, redirect_slashes=False)

# Configure CORS
origins = settings.CORS_ORIGINS.split(',') if settings.CORS_ORIGINS else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
