// src/types/api/responses.ts

/**
 * Token usage returned by the backend.
 */
export interface TokenUsageResponse {
    prompt_tokens: number;

    completion_tokens: number;

    total_tokens: number;
}

/**
 * Response returned by POST /chat.
 */
export interface ChatResponse {
    content: string;

    usage?: TokenUsageResponse;

    finish_reason?: string;
}