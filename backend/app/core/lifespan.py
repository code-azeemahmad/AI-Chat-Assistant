import logging
from contextlib import asynccontextmanager

import httpx
from app.core.config import settings
from fastapi import FastAPI

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan.

    Creates a shared AsyncClient on startup and
    gracefully closes it on shutdown.
    """

    logger.info("Starting AI Chat Backend...")

    timeout = httpx.Timeout(
        connect=5.0,
        read=settings.request_timeout,
        write=5.0,
        pool=5.0,
    )

    try:
        app.state.http_client = httpx.AsyncClient(
            timeout=timeout,
        )

        logger.info("Shared AsyncClient initialized successfully.")

        yield

    finally:
        logger.info("Closing shared AsyncClient...")

        await app.state.http_client.aclose()

        logger.info("Shared AsyncClient closed successfully.")

        logger.info("AI Chat Backend stopped.")