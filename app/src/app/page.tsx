"use client";
import React, { useState, useCallback } from "react";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { MessageData, ChatMode } from "@/types/chat";
import { useOpenAI } from "@/hooks/useOpenAI";

export default function ChatDemoPage() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [mode, setMode] = useState<ChatMode>("text");
  const { isLoading, error, sendMessage, clearError } = useOpenAI();

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    console.log("Sending message:", message);
    
    // Add user message
    const userMessage: MessageData = {
      id: crypto.randomUUID(),
      role: "user",
      content: message.trim(),
      type: mode,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Send to OpenAI API with streaming
    await sendMessage(
      message,
      // onStreamingChunk - update the last message with streaming content
      (content: string) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content += content;
          }
          return newMessages;
        });
      },
      // onComplete - finalize the message
      (aiMessage: MessageData) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
            // Update the existing message
            Object.assign(lastMessage, aiMessage);
          } else {
            // Add as new message if not found
            newMessages.push(aiMessage);
          }
          return newMessages;
        });
      },
      // onError - handle errors
      (errorMessage: string) => {
        console.error("OpenAI Error:", errorMessage);
        // Add error message to chat
        const errorMsg: MessageData = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Error: ${errorMessage}`,
          type: "text",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    );
  }, [mode, sendMessage]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    clearError();
  }, [clearError]);

  const handleModeChange = useCallback((newMode: ChatMode) => {
    setMode(newMode);
    clearError();
  }, [clearError]);

  return (
    <ChatLayout
      messages={messages}
      onSendMessage={handleSendMessage}
      onNewChat={handleNewChat}
      mode={mode}
      onModeChange={handleModeChange}
      isLoading={isLoading}
    />
  );
}
