// src/components/chat/MessageBubble.tsx

import MarkdownRenderer from "../common/MarkdownRenderer";

import { ChatRole, type ChatMessage } from "../../types/domain/chat";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === ChatRole.USER;

  return (
    <div className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-3xl rounded-xl px-4 py-3 ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <div
          className={`max-w-none ${
            isUser
              ? "prose prose-invert text-white"
              : "prose prose-slate text-gray-900"
          }`}
        >
          <div className="relative">
            <MarkdownRenderer
              content={message.content}
              isStreaming={message.isStreaming}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
