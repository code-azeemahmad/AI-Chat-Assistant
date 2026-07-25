// src/types/stream/stream.ts

import type { TokenUsage } from "../domain/chat";

/**
 * Internal streaming event types.
 */
export enum StreamEventType {
    TEXT = "text",

    DONE = "done",
}

/**
 * Internal stream event used throughout the application.
 */
export interface StreamEvent {
    type: StreamEventType;

    content: string;

    usage?: TokenUsage;

    finishReason?: string;
}