"use client";
import { useState, useCallback } from "react";

export interface MessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  type: "text" | "image";
  imageUrl?: string;
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((message: Omit<MessageData, "id" | "timestamp">) => {
    const newMessage: MessageData = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    messages,
    isLoading,
    addMessage,
    clearMessages,
    setLoading,
  };
}
