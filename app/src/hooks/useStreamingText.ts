"use client";
import { useState, useCallback } from "react";

export function useStreamingText() {
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const startStreaming = useCallback(() => {
    setStreamingText("");
    setIsStreaming(true);
  }, []);

  const updateStreamingText = useCallback((text: string) => {
    setStreamingText(text);
  }, []);

  const finishStreaming = useCallback(() => {
    setIsStreaming(false);
    const finalText = streamingText;
    setStreamingText("");
    return finalText;
  }, [streamingText]);

  const stopStreaming = useCallback(() => {
    setIsStreaming(false);
    setStreamingText("");
  }, []);

  return {
    streamingText,
    isStreaming,
    startStreaming,
    updateStreamingText,
    finishStreaming,
    stopStreaming,
  };
}
