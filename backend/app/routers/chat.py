# app/routers/chat.py
from __future__ import annotations

from app.dependencies import get_chat_service
from app.mappers.chat_mapper import ChatMapper
from app.schemas.chat import (
    ChatRequestSchema,
    ChatResponseSchema,
)
from app.serializers.sse import SSESerializer
from app.services.chat_service import ChatService
from fastapi import APIRouter, Depends, status
from fastapi.responses import StreamingResponse

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


@router.post(
    "/stream",
    response_class=StreamingResponse,
)
async def stream_chat(
    request: ChatRequestSchema,
    service: ChatService = Depends(  # noqa: B008
        get_chat_service,
    ),
):
    """
    Stream chat responses using Server-Sent Events.
    """

    domain_request = ChatMapper.to_domain(request)

    async def event_generator():

        async for event in service.stream_response(
            domain_request,
        ):
            yield SSESerializer.serialize(event)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
    )