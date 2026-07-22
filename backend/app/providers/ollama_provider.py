# app/providers/ollama_provider.py
from __future__ import annotations

import httpx

from app.domain.chat import (
    ChatMessage,
    ChatRequest,
    ChatResponse,
    TokenUsage,
)
from app.providers.base import LLMProvider
from app.providers.ollama_models import (
    OllamaChatRequest,
    OllamaChatResponse,
    OllamaMessage,
    OllamaOptions,
)
from app.core.config import settings
from app.exceptions.llm import (
    LLMAuthenticationError,
    LLMConnectionError,
    LLMProviderError,
    LLMRateLimitError,
    LLMResponseError,
    LLMTimeoutError,
)


class OllamaProvider(LLMProvider):
    """
    Concrete implementation of the LLMProvider interface for Ollama.
    """

    def __init__(self, client: httpx.AsyncClient):
        self._client = client

    async def generate_response(
        self,
        request: ChatRequest,
    ) -> ChatResponse:
        """
        Generate a response from Ollama.
        """

        payload = self._build_payload(request)

        response = await self._send_request(payload)

        return self._to_domain_response(response)

    # ------------------------------------------------------------------
    # Payload
    # ------------------------------------------------------------------

    def _build_payload(
        self,
        request: ChatRequest,
    ) -> OllamaChatRequest:

        return OllamaChatRequest(
            model=settings.ollama_model,
            stream=False,
            messages=[
                self._to_ollama_message(message)
                for message in request.messages
            ],
            options=OllamaOptions(
                temperature=request.temperature,
                num_predict=request.max_tokens,
            ),
        )

    # ------------------------------------------------------------------
    # HTTP
    # ------------------------------------------------------------------

    async def _send_request(
        self,
        payload: OllamaChatRequest,
    ) -> OllamaChatResponse:

        timeout = httpx.Timeout(
            connect=5.0,
            read=settings.request_timeout,
            write=5.0,
            pool=5.0,
        )

        try:
            response = await self._client.post(
                url=f"{settings.ollama_base_url}/api/chat",
                json=payload.model_dump(),
                timeout=timeout,
            )

            response.raise_for_status()

            return OllamaChatResponse.model_validate(
                response.json()
            )

        except httpx.ConnectError as exc:
            raise LLMConnectionError(
                "Unable to connect to Ollama."
            ) from exc

        except httpx.TimeoutException as exc:
            raise LLMTimeoutError(
                "Request to Ollama timed out."
            ) from exc

        except httpx.HTTPStatusError as exc:

            status = exc.response.status_code

            if status == 401:
                raise LLMAuthenticationError(
                    "Authentication failed."
                ) from exc

            if status == 429:
                raise LLMRateLimitError(
                    "Rate limit exceeded."
                ) from exc

            raise LLMProviderError(
                f"Ollama returned HTTP {status}."
            ) from exc

        except Exception as exc:
            raise LLMResponseError(
                "Invalid response received from Ollama."
            ) from exc

    # ------------------------------------------------------------------
    # Domain Conversion
    # ------------------------------------------------------------------

    def _to_domain_response(
        self,
        response: OllamaChatResponse,
    ) -> ChatResponse:

        usage = None

        if (
            response.prompt_eval_count is not None
            and response.eval_count is not None
        ):
            usage = TokenUsage(
                prompt_tokens=response.prompt_eval_count,
                completion_tokens=response.eval_count,
                total_tokens=(
                    response.prompt_eval_count
                    + response.eval_count
                ),
            )

        return ChatResponse(
            content=response.message.content,
            usage=usage,
            finish_reason=response.done_reason,
        )

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _to_ollama_message(
        message: ChatMessage,
    ) -> OllamaMessage:

        return OllamaMessage(
            role=message.role.value,
            content=message.content,
        )