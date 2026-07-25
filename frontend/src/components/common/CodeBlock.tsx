// src/components/common/CodeBlock.tsx

import { useState } from "react";

import {
    Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import {
    oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
    language?: string;

    value: string;
}

export default function CodeBlock({
    language,
    value,
}: CodeBlockProps) {
    const [copied, setCopied] =
        useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(
                value,
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error(
                "Failed to copy code:",
                error,
            );
        }
    }

    return (
        <div className="relative my-4">
            <button
                onClick={handleCopy}
                className="
                    absolute
                    right-3
                    top-3
                    rounded
                    bg-neutral-700
                    px-2
                    py-1
                    text-xs
                    text-white
                    transition-colors
                    hover:bg-neutral-600
                "
            >
                {copied
                    ? "Copied!"
                    : "Copy"}
            </button>

            <SyntaxHighlighter
                language={language}
                style={oneDark}
                PreTag="div"
            >
                {value.trimEnd()}
            </SyntaxHighlighter>
        </div>
    );
}