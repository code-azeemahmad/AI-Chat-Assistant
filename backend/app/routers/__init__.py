from app.routers import chat, health
from fastapi import FastAPI

API_PREFIX = "/api/v1"

def register_routes(app: FastAPI) -> None:
    app.include_router(chat.router, prefix=API_PREFIX)
    app.include_router(health.router, prefix=API_PREFIX)