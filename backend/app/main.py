# app/main.py
from __future__ import annotations

from app.core.config import settings
from app.core.lifespan import lifespan
from app.exceptions.handlers import register_exception_handlers
from app.routers.__init__ import register_routes
from fastapi import FastAPI

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Register global exception handlers
register_exception_handlers(app)

# Register routers
register_routes(app)

@app.get("/")
async def root():
    return {
        "app": settings.app_name,
        "version": settings.app_version,
    }