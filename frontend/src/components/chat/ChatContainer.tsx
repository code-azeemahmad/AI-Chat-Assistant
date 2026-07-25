// src\components\chat\ChatContainer.tsx
import { useChatStore } from "../../store/chat";
import { useAutoScroll } from "../../hooks/useAutoScroll";

import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ScrollToLatestButton from "./ScrollToLatestButton";

export default function ChatContainer() {
    const {
        messages,
        isStreaming,
        sendMessage,
    } = useChatStore();

    const lastMessage =
        messages[messages.length - 1];

    const {
        containerRef,
        bottomRef,
        autoScroll,
        handleScroll,
        scrollToBottom,
        enableAutoScroll,
    } = useAutoScroll(
        `${lastMessage?.id ?? ""}:${lastMessage?.content.length ?? 0}`,
    );

    return (
        <div className="relative flex h-full flex-col">
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 pb-24"
            >
                <MessageList
                    messages={messages}
                />

                <div ref={bottomRef} />
            </div>

            {!autoScroll && (
                <ScrollToLatestButton
                    onClick={() => {
                        enableAutoScroll();
                        scrollToBottom("smooth");
                    }}
                />
            )}

            <ChatInput
                onSend={sendMessage}
                disabled={isStreaming}
            />
        </div>
    );
}