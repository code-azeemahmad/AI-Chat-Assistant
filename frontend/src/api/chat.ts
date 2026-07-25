// src/api/chat.ts
import { apiClient } from "./client";

import { config } from "../lib/config";

import { SSEParser } from "../serializers/sse";
import { StreamMapper } from "../mappers/stream";

import type { ChatRequest } from "../types/api/requests";
import type { ChatResponse } from "../types/api/responses";
import type { StreamEvent } from "../types/stream/stream";

export interface ChatApi {
  /**
   * Generate a complete chat response.
   */
  generateResponse(request: ChatRequest): Promise<ChatResponse>;

  /**
   * Stream chat events from the backend.
   */
  streamResponse(request: ChatRequest): AsyncGenerator<StreamEvent, void, void>;
}

class DefaultChatApi implements ChatApi {
  /**
   * Generate a complete response.
   */
  async generateResponse(request: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>("/chat", request);

    return response.data;
  }

  /**
   * Stream chat events.
   */
  /**
   * Stream chat events.
   */
  async *streamResponse(
    request: ChatRequest,
  ): AsyncGenerator<StreamEvent, void, void> {
    const response = await fetch(`${config.apiUrl}/chat/stream`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body is missing.");
    }

    const reader = response.body.getReader();

    const decoder = new TextDecoder();

    // One parser instance per stream.
    const parser = new SSEParser();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });

      const events = parser.parse(chunk);

      for (const event of events) {
        yield StreamMapper.toDomain(event);
      }
    }

    // Emit any remaining buffered events.
    for (const event of parser.flush()) {
      yield StreamMapper.toDomain(event);
    }
  }
}

export const chatApi: ChatApi = new DefaultChatApi();
