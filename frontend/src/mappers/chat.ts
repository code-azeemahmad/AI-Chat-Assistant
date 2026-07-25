// src/mappers/chat.ts

import {
  ChatRole,
  type ChatMessage,
  type TokenUsage,
} from "../types/domain/chat";

import type { ChatRequest, ChatMessageRequest } from "../types/api/requests";

import type { ChatResponse, TokenUsageResponse } from "../types/api/responses";

export class ChatMapper {
  /**
   * Convert a conversation into an API request.
   */

  static toRequest(messages: ChatMessage[]): ChatRequest {
    return {
      messages: messages
        .filter((message) => message.content.trim().length > 0)
        .map(this.toRequestMessage),

      temperature: 0.7,

      max_tokens: 1024,
    };
  }

  /**
   * Convert an API response into a domain message.
   */
  static toAssistantMessage(response: ChatResponse): ChatMessage {
    return {
      id: crypto.randomUUID(),

      role: ChatRole.ASSISTANT,

      content: response.content,

      createdAt: new Date(),

      isStreaming: false,

      usage: response.usage ? this.toUsage(response.usage) : undefined,

      finishReason: response.finish_reason,
    };
  }

  /**
   * Convert one domain message into an API message.
   */
  private static toRequestMessage(message: ChatMessage): ChatMessageRequest {
    return {
      role: message.role,

      content: message.content,
    };
  }

  /**
   * Convert API token usage into the
   * frontend domain model.
   */
  private static toUsage(usage: TokenUsageResponse): TokenUsage {
    return {
      promptTokens: usage.prompt_tokens,

      completionTokens: usage.completion_tokens,

      totalTokens: usage.total_tokens,
    };
  }
}
