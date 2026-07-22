# app/core/lifespan.py
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI

from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Shared AsyncClient
    """
    timeout = httpx.Timeout(
        connect=5,
        read=settings.request_timeout,
        write=5,
        pool=5,
    )

    app.state.http_client = httpx.AsyncClient(
        timeout=timeout
    )

    yield

    await app.state.http_client.aclose()