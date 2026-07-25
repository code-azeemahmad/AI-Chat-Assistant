// src/types/api/stream.ts

/**
 * Raw stream event returned by the backend.
 * Mirrors the FastAPI StreamEvent schema.
 */

export enum ApiStreamEventType {
    TEXT = "text",
    DONE = "done",
}

export interface ApiTokenUsage {
    prompt_tokens: number;

    completion_tokens: number;

    total_tokens: number;
}

export interface ApiStreamEvent {
    type: ApiStreamEventType;

    content: string;

    usage?: ApiTokenUsage;

    finish_reason?: string;
}