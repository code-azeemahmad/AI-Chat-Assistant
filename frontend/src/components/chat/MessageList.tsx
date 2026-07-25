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
        <>
            {messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    message={message}
                />
            ))}
        </>
    );
}