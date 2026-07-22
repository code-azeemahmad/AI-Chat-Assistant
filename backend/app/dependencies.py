# app/dependencies.py
from __future__ import annotations
from fastapi import Depends
import httpx
from app.exceptions import UnsupportedProviderError
from app.providers.base import LLMProvider
from app.providers.ollama_provider import OllamaProvider
from app.core.config import settings
from app.services.chat_service import ChatService
from fastapi import Request

def get_http_client(
    request: Request,
) -> httpx.AsyncClient:

    return request.app.state.http_client

def get_llm_provider(
    client: httpx.AsyncClient = Depends(get_http_client),
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