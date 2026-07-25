import { useCallback, useEffect, useRef, useState } from "react";

const SCROLL_THRESHOLD = 120;

export function useAutoScroll(dependency: unknown) {
  const containerRef = useRef<HTMLDivElement>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior,
        block: "end",
      });
    });
  }, []);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const distance =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    setAutoScroll(distance < SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    if (!autoScroll) {
      return;
    }

    requestAnimationFrame(() => {
      scrollToBottom("auto");
    });
  }, [dependency, autoScroll, scrollToBottom]);

  return {
    containerRef,
    bottomRef,
    autoScroll,
    handleScroll,
    scrollToBottom,
    enableAutoScroll: () => {
      setAutoScroll(true);

      scrollToBottom("smooth");
    },
  };
}
