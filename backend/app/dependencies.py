# app/dependencies.py
from __future__ import annotations

import httpx
from app.core.config import settings
from app.exceptions import UnsupportedProviderError
from app.providers.base import LLMProvider
from app.providers.ollama_provider import OllamaProvider
from app.services.chat_service import ChatService
from fastapi import Depends, Request


def get_http_client(
    request: Request,
) -> httpx.AsyncClient:

    return request.app.state.http_client

def get_llm_provider(
    client: httpx.AsyncClient = Depends(get_http_client),  # noqa: B008
) -> LLMProvider:
    """
    Return the configured LLM provider.
    """

    provider = settings.llm_provider.lower()

    if provider == "ollama":
        return OllamaProvider(client)

    raise UnsupportedProviderError(provider)


def get_chat_service(
    provider: LLMProvider = Depends(get_llm_provider),  # noqa: B008
) -> ChatService:
    return ChatService(provider)