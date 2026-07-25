// src/components/chat/ChatInput.tsx

import {
    useState,
    type FormEvent,
} from "react";

interface ChatInputProps {
    onSend(
        content: string,
    ): Promise<void>;

    disabled: boolean;
}

export default function ChatInput({
    onSend,
    disabled,
}: ChatInputProps) {
    const [content, setContent] =
        useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const trimmed = content.trim();

        if (!trimmed) {
            return;
        }

        try {
            await onSend(trimmed);

            setContent("");
        } catch {
            // Keep the user's text so they can retry.
        }
    }

    return (
        <div className="border-t bg-white p-4">
            <form
                onSubmit={handleSubmit}
                className="flex gap-2"
            >
                <textarea
                    value={content}
                    onChange={(event) =>
                        setContent(
                            event.target.value,
                        )
                    }
                    rows={2}
                    disabled={disabled}
                    placeholder="Type your message..."
                    className="flex-1 resize-none rounded-lg border p-3"
                />

                <button
                    type="submit"
                    disabled={disabled}
                    className="rounded-lg bg-blue-600 px-5 text-white disabled:opacity-50"
                >
                    Send
                </button>
            </form>
        </div>
    );
}