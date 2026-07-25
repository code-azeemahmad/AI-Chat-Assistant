// src\components\chat\ChatContainer.tsx
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

import { useChatStore } from "../../store/chat";

export default function ChatContainer() {
    const {
        messages,
        isStreaming,
        sendMessage,
    } = useChatStore();

    return (
        <section className="flex h-full flex-col">
            <MessageList
                messages={messages}
            />

            {isStreaming && (
                <TypingIndicator />
            )}

            <ChatInput
                onSend={sendMessage}
                disabled={isStreaming}
            />
        </section>
    );
}