"use client";
import React from "react";
import { Message } from "./Message";

interface MessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  type: "text" | "image";
  imageUrl?: string;
  timestamp: Date;
}

interface MessageListProps {
  messages: MessageData[];
  isLoading: boolean;
  streamingText?: string;
}

export function MessageList({ messages, isLoading, streamingText }: MessageListProps) {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            Try asking a question to get started!
          </h2>
          <p className="text-sm text-muted-foreground">
            Start a conversation or generate an image
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <Message key={message.id} message={message} />
        ))
      )}
      
      {/* Streaming text or loading indicator */}
      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold">AI</span>
          </div>
          <div className="bg-muted rounded-lg p-3 max-w-2xl">
            {streamingText ? (
              <p className="text-sm whitespace-pre-wrap">{streamingText}</p>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-200"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
