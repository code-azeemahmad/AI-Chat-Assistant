// src/store/chat.ts

import { create } from "zustand";

import { chatApi } from "../api/chat";

import { ChatMapper } from "../mappers/chat";

import { ChatRole } from "../types/domain/chat";

import { StreamEventType } from "../types/stream/stream";

import type { ChatMessage, TokenUsage } from "../types/domain/chat";

/* -------------------------------------------------------------------------- */
/* State                                                                       */
/* -------------------------------------------------------------------------- */

export interface ChatState {
  /**
   * Current conversation.
   */
  messages: ChatMessage[];

  /**
   * True while waiting for
   * the first streamed token.
   */
  isLoading: boolean;

  /**
   * True while the assistant
   * is generating a response.
   */
  isStreaming: boolean;

  /**
   * Latest application error.
   */
  error: string | null;
}

/* -------------------------------------------------------------------------- */
/* Actions                                                                     */
/* -------------------------------------------------------------------------- */

export interface ChatActions {
  /**
   * Send a user message.
   */
  sendMessage(content: string): Promise<void>;

  /**
   * Append a message to
   * the conversation.
   */
  appendMessage(message: ChatMessage): void;

  /**
   * Append streamed text to
   * the assistant message.
   */
  updateStreamingMessage(id: string, token: string): void;

  /**
   * Finish streaming and
   * attach metadata.
   */
  finishStreamingMessage(
    id: string,
    usage?: TokenUsage,
    finishReason?: string,
  ): void;

  /**
   * Remove every message.
   */
  clearConversation(): void;

  /**
   * Store an application error.
   */
  setError(message: string): void;

  /**
   * Clear the current error.
   */
  resetError(): void;
}

export type ChatStore = ChatState & ChatActions;

/* -------------------------------------------------------------------------- */
/* Store                                                                       */
/* -------------------------------------------------------------------------- */

export const useChatStore = create<ChatStore>()((set, get) => ({
  /* ------------------------------------------------------------------ */
  /* State                                                              */
  /* ------------------------------------------------------------------ */

  messages: [],

  isLoading: false,

  isStreaming: false,

  error: null,

  /* ------------------------------------------------------------------ */
  /* Public API                                                         */
  /* ------------------------------------------------------------------ */

  sendMessage: async (content: string) => {
    const trimmed = content.trim();

    if (!trimmed) {
      return;
    }

    const {
      appendMessage,
      updateStreamingMessage,
      finishStreamingMessage,
      setError,
      resetError,
    } = get();

    resetError();

    set({
      isLoading: true,
      isStreaming: true,
    });

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),

      role: ChatRole.USER,

      content: trimmed,

      createdAt: new Date(),

      isStreaming: false,
    };

    appendMessage(userMessage);

    const assistantMessage: ChatMessage = {
        
      id: crypto.randomUUID(),

      role: ChatRole.ASSISTANT,

      content: "",

      createdAt: new Date(),

      isStreaming: true,
    };

    appendMessage(assistantMessage);

    const { messages } = get();

    const request = ChatMapper.toRequest(messages);

    try {
      for await (const event of chatApi.streamResponse(request)) {
        switch (event.type) {
          case StreamEventType.TEXT:
            updateStreamingMessage(assistantMessage.id, event.content);
            break;

          case StreamEventType.DONE:
            finishStreamingMessage(
              assistantMessage.id,
              event.usage,
              event.finishReason,
            );
            break;

          default:
            break;
        }
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to generate response.",
      );
    } finally {
      set({
        isLoading: false,
        isStreaming: false,
      });
    }
  },

  appendMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateStreamingMessage: (id, token) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id
          ? {
              ...message,
              content: message.content + token,
            }
          : message,
      ),
    })),

  finishStreamingMessage: (id, usage, finishReason) =>
    set((state) => ({
      isLoading: false,

      isStreaming: false,

      messages: state.messages.map((message) =>
        message.id === id
          ? {
              ...message,
              isStreaming: false,
              usage,
              finishReason,
            }
          : message,
      ),
    })),

  clearConversation: () =>
    set({
      messages: [],

      isLoading: false,

      isStreaming: false,

      error: null,
    }),

  setError: (message) =>
    set({
      error: message,
    }),

  resetError: () =>
    set({
      error: null,
    }),
}));
