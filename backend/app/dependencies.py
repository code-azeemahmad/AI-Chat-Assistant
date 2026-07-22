# app/dependencies.py
from __future__ import annotations
from fastapi import Depends
import httpx
from app.exceptions import UnsupportedProviderError
from app.providers.base import LLMProvider
from app.providers.ollama_provider import OllamaProvider
from app.core.config import settings
from app.services.chat_service import ChatService


def get_http_client() -> httpx.AsyncClient:
    """
    Factory for Async HTTP client.
    """

    timeout = httpx.Timeout(
        connect=5.0,
        read=settings.request_timeout,
        write=5.0,
        pool=5.0,
    )

    return httpx.AsyncClient(timeout=timeout)


def get_llm_provider(
    client: httpx.AsyncClient,
) -> LLMProvider:
    """
    Return the configured LLM provider.
    """

    provider = settings.llm_provider.lower()

    if provider == "ollama":
        return OllamaProvider(client)

    raise UnsupportedProviderError(provider)


def get_chat_service(
    provider: LLMProvider = Depends(get_llm_provider),
) -> ChatService:
    return ChatService(provider)