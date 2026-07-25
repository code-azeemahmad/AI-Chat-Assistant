import type {
    ApiStreamEvent,
} from "../types/api/stream";

/**
 * Incrementally parses Server-Sent Events (SSE).
 *
 * Network chunks do not necessarily align with SSE event
 * boundaries, so incomplete data is buffered until the
 * remaining bytes arrive.
 */
export class SSEParser {
    private buffer = "";

    /**
     * Parse a decoded text chunk into zero or more
     * API stream events.
     */
    parse(
        chunk: string,
    ): ApiStreamEvent[] {
        this.buffer += chunk;

        const events: ApiStreamEvent[] = [];

        const messages =
            this.buffer.split("\n\n");

        // Keep the last incomplete message
        this.buffer =
            messages.pop() ?? "";

        for (const message of messages) {
            const line =
                message.trim();

            if (!line.startsWith("data:")) {
                continue;
            }

            const json =
                line.slice(5).trim();

            if (!json) {
                continue;
            }

            try {
                events.push(
                    JSON.parse(
                        json,
                    ) as ApiStreamEvent,
                );
            } catch {
                // Ignore malformed JSON.
            }
        }

        return events;
    }

    /**
     * Flush any remaining buffered data.
     *
     * Useful when the stream ends.
     */
    flush(): ApiStreamEvent[] {
        if (!this.buffer.trim()) {
            return [];
        }

        const remaining =
            this.buffer;

        this.buffer = "";

        return this.parse(
            `${remaining}\n\n`,
        );
    }
}