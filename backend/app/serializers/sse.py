# app/serializers/sse.py
import json

from app.domain.stream import StreamEvent


class SSESerializer:
    """
    Serialize StreamEvents into Server-Sent Events (SSE).
    """

    @staticmethod
    def serialize(
        event: StreamEvent,
    ) -> str:
        """
        Convert a StreamEvent into SSE format.
        """

        payload = event.model_dump(
            mode="json",
            exclude_none=True,
        )

        return (
            f"data: {json.dumps(payload)}\n\n"
        )