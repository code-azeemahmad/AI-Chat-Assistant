// src/components/chat/MessageBubble.tsx

import { ChatRole, type ChatMessage } from "../../types/domain/chat";

interface MessageBubbleProps {
    message: ChatMessage;
}

export default function MessageBubble({
    message,
}: MessageBubbleProps) {
    const isUser =
        message.role === ChatRole.USER;

    return (
        <div
            className={`mb-4 flex ${
                isUser
                    ? "justify-end"
                    : "justify-start"
            }`}
        >
            <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    isUser
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-900"
                }`}
            >
                {message.content}
            </div>
        </div>
    );
}