"use client";
import React from "react";
import { Message } from "./Message";
import { MessageData } from "@/types/chat";

interface MessageListProps {
  messages: MessageData[];
  isLoading: boolean;
  streamingText?: string;
}

export function MessageList({ messages, isLoading, streamingText }: MessageListProps) {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      
      {/* Streaming text or loading indicator */}
      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 max-w-2xl">
            {streamingText ? (
              <p className="text-sm text-white whitespace-pre-wrap">{streamingText}</p>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
