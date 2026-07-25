import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CodeBlock from "./CodeBlock";

interface MarkdownRendererProps {
    content: string;
}

export default function MarkdownRenderer({
    content,
}: MarkdownRendererProps) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({
                    className,
                    children,
                    ...props
                }) {
                    const match =
                        /language-(\w+)/.exec(
                            className ?? "",
                        );

                    const language =
                        match?.[1];

                    const value =
                        String(children);

                    if (!language) {
                        return (
                            <code
                                className={className}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    }

                    return (
                        <CodeBlock
                            language={language}
                            value={value}
                        />
                    );
                },
            }}
        >
            {content}
        </ReactMarkdown>
    );
}