from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import models
from .config import settings
from .database import Base, engine
from .routers import auth, documents, users

# Creates tables if they don't exist yet. Fine for development; for
# production changes later, use a real migration tool (e.g. Alembic)
# instead of relying on this.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SignWyz API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(documents.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}