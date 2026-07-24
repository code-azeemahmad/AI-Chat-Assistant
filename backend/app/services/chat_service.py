# app/services/chat_service.py
from __future__ import annotations

from collections.abc import AsyncGenerator

from app.core.logging import logger
from app.domain.chat import (
    ChatRequest,
    ChatResponse,
)
from app.domain.stream import StreamEvent
from app.exceptions.llm import LLMError
from app.providers.base import LLMProvider


class ChatService:
    """
    Handles application business logic for chat.
    """

    def __init__(
        self,
        provider: LLMProvider,
    ):
        self._provider = provider

    async def generate_response(
        self,
        request: ChatRequest,
    ) -> ChatResponse:
        """
        Generate a chat response.
        """

        logger.info("Generating chat response.")

        try:
            response = await self._provider.generate_response(request)

            logger.info("Chat response generated successfully.")

            return response

        except LLMError:

            logger.exception("LLM provider failed.")

            raise

    async def stream_response(
        self,
        request: ChatRequest,
    ) -> AsyncGenerator[StreamEvent, None]:
        """
        Stream a chat response.
        """

        logger.info(
            "Starting chat stream.",
            extra={
                "message_count": len(request.messages),
                "temperature": request.temperature,
                "max_tokens": request.max_tokens,
            },
        )

        try:

            async for event in self._provider.stream_response(request):
                yield event

            logger.info("Chat stream completed.")

        except LLMError:

            logger.exception("LLM provider failed during streaming.")

            raise
