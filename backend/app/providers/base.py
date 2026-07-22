# backend/app/providers/base.py
from abc import ABC, abstractmethod

from app.domain.chat import ChatRequest, ChatResponse


class LLMProvider(ABC):

    @abstractmethod
    async def generate_response(
        self,
        request: ChatRequest,
    ) -> ChatResponse:
        """
        Generate a response from the language model.
        """
        raise NotImplementedError