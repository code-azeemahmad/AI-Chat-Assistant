// src/mappers/stream.ts

import {
    type StreamEvent,
    StreamEventType,
} from "../types/stream/stream";

import type {
    ApiStreamEvent,
    ApiTokenUsage,
} from "../types/api/stream";

export class StreamMapper {
    static toDomain(
        event: ApiStreamEvent,
    ): StreamEvent {
        return {
            type:
                event.type === "text"
                    ? StreamEventType.TEXT
                    : StreamEventType.DONE,

            content: event.content,

            usage: event.usage
                ? this.toUsage(event.usage)
                : undefined,

            finishReason:
                event.finish_reason,
        };
    }

    private static toUsage(
        usage: ApiTokenUsage,
    ) {
        return {
            promptTokens:
                usage.prompt_tokens,

            completionTokens:
                usage.completion_tokens,

            totalTokens:
                usage.total_tokens,
        };
    }
}