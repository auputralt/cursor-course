"use client";
import { useState, useCallback } from "react";
import { MessageData } from "@/types/chat";

export function useOpenAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    message: string,
    onStreamingChunk: (content: string) => void,
    onComplete: (fullMessage: MessageData) => void,
    onError: (error: string) => void
  ) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to send message';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If response is not JSON (like HTML error page), use status text
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      // Create the AI message object
      const aiMessage: MessageData = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        type: 'text',
        timestamp: new Date(),
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                // Streaming complete
                aiMessage.content = fullContent;
                onComplete(aiMessage);
                return;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullContent += parsed.content;
                  aiMessage.content = fullContent;
                  onStreamingChunk(parsed.content);
                }
              } catch (parseError) {
                // If we get HTML content instead of JSON, it's likely an error page
                if (data.includes('<!DOCTYPE') || data.includes('<html')) {
                  throw new Error('Server returned HTML error page instead of streaming response');
                }
                // Ignore parsing errors for malformed chunks
                console.warn('Failed to parse streaming chunk:', parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

    } catch (error) {
      console.error('OpenAI API error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    sendMessage,
    clearError,
  };
}
