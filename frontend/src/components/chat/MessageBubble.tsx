import MarkdownRenderer from "../common/MarkdownRenderer";
import StreamingCursor from "./StreamingCursor";

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
          isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
        }`}
      >
        <div className="prose prose-invert max-w-none">
          <MarkdownRenderer content={message.content} />

          {message.isStreaming && <StreamingCursor />}
        </div>
      </div>
    </div>
  );
}
