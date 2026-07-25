// src/types/api/requests.ts

/**
 * Chat roles as defined by the backend API.
 */
export type ChatRoleApi =
    | "system"
    | "user"
    | "assistant";

/**
 * API request message.
 */
export interface ChatMessageRequest {
    role: ChatRoleApi;
    content: string;
}

/**
 * POST /api/v1/chat
 * POST /api/v1/chat/stream
 */
export interface ChatRequest {
    messages: ChatMessageRequest[];

    temperature: number;

    max_tokens: number;
}