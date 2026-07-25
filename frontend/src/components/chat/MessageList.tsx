// src/components/chat/MessageList.tsx

import MessageBubble from "./MessageBubble";

import type {
    ChatMessage,
} from "../../types/domain/chat";

interface MessageListProps {
    messages: ChatMessage[];
}

export default function MessageList({
    messages,
}: MessageListProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    message={message}
                />
            ))}
        </div>
    );
}