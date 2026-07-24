from app.routers import chat, health
from fastapi import FastAPI


def register_routes(app: FastAPI) -> None:
    app.include_router(chat.router)
    app.include_router(health.router)