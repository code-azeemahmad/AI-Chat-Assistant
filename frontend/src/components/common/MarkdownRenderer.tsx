// src/components/common/MarkdownRenderer.tsx

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import StreamingCursor from "../chat/StreamingCursor";

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export default function MarkdownRenderer({
  content,
  isStreaming = false,
}: MarkdownRendererProps) { 
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p({ children }) {
          return (
            <p>
              {children}

              {isStreaming && <StreamingCursor />}
            </p>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
