from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.database import engine
from app.db.base import Base
from app.db import import_models  # noqa: F401

from app.routes.auth import router as auth_router
from app.routes.quiz import router as quiz_router
from app.routes.results import router as results_router

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/api/health")
def healthcheck() -> dict:
    return {"status": "ok"}


app.include_router(auth_router)
app.include_router(quiz_router, prefix="/api/quiz", tags=["quiz"])
app.include_router(results_router)