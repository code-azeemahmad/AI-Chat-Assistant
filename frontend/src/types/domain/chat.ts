// src/types/domain/chat.ts

export enum ChatRole {
    SYSTEM = "system",
    USER = "user",
    ASSISTANT = "assistant",
}

export interface TokenUsage {
    promptTokens: number;

    completionTokens: number;

    totalTokens: number;
}

export interface ChatMessage {
    id: string;

    role: ChatRole;

    content: string;

    createdAt: Date;

    isStreaming: boolean;

    usage?: TokenUsage;

    finishReason?: string;
}