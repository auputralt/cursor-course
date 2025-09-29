"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ModeToggle } from "./ModeToggle";

interface ChatLayoutProps {
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    type: "text" | "image";
    imageUrl?: string;
    timestamp: Date;
  }>;
  onSendMessage: (message: string) => void;
  onNewChat: () => void;
  mode: "text" | "image";
  onModeChange: (mode: "text" | "image") => void;
  isLoading: boolean;
  streamingText?: string;
}

export function ChatLayout({
  messages,
  onSendMessage,
  onNewChat,
  mode,
  onModeChange,
  isLoading,
  streamingText,
}: ChatLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">AI</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">ChatGPT</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onNewChat}
          className="text-sm"
        >
          New Chat
        </Button>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={messages} isLoading={isLoading} streamingText={streamingText} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card p-4">
          <div className="max-w-4xl mx-auto">
            {/* Mode Toggle */}
            <div className="mb-4 flex justify-center">
              <ModeToggle mode={mode} onModeChange={onModeChange} />
            </div>
            
            {/* Message Input */}
            <MessageInput
              onSendMessage={onSendMessage}
              mode={mode}
              disabled={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
