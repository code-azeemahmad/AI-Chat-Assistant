# app/routers/chat.py
from __future__ import annotations

from app.dependencies import get_chat_service
from app.mappers.chat_mapper import ChatMapper
from app.schemas.chat import (
    ChatRequestSchema,
    ChatResponseSchema,
)
from app.services.chat_service import ChatService
from fastapi import APIRouter, Depends, status

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post(
    "",
    response_model=ChatResponseSchema,
    status_code=status.HTTP_200_OK,
    summary="Generate an AI chat response",
)
async def generate_chat_response(
    request: ChatRequestSchema,
    service: ChatService = Depends(get_chat_service),  # noqa: B008
) -> ChatResponseSchema:
    """
    Generate a response from the configured LLM.
    """

    domain_request = ChatMapper.to_domain(request)

    domain_response = await service.generate_response(domain_request)

    return ChatMapper.to_schema(domain_response)
