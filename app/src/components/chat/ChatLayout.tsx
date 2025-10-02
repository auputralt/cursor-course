"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ModeToggle } from "./ModeToggle";
import { MessageData, ChatMode } from "@/types/chat";

interface ChatLayoutProps {
  messages: MessageData[];
  onSendMessage: (message: string) => void;
  onImageUpload?: (file: File) => void;
  onNewChat: () => void;
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  isLoading: boolean;
  streamingText?: string;
}

export function ChatLayout({
  messages,
  onSendMessage,
  onImageUpload,
  onNewChat,
  mode,
  onModeChange,
  isLoading,
  streamingText,
}: ChatLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-gray-900 font-bold text-sm">AI</span>
          </div>
          <h1 className="text-xl font-semibold text-white">ChatGPT 5 by Mr. Putra</h1>
          <div className="text-gray-200 text-sm hover:text-white cursor-pointer transition-colors">▼</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-600 border border-gray-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-500 hover:border-gray-400 transition-colors">
            <div className="w-3 h-3 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          /* Welcome Screen - ChatGPT 5 Style */
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-semibold text-white mb-4">
                What's on your mind today?
              </h2>
            </div>
            
            {/* Message Input - Centered */}
            <div className="w-full max-w-4xl">
              {/* Mode Toggle */}
              <div className="mb-4 flex justify-center">
                <ModeToggle mode={mode} onModeChange={onModeChange} />
              </div>
              
              <MessageInput
                onSendMessage={onSendMessage}
                onImageUpload={onImageUpload}
                mode={mode}
                disabled={isLoading}
              />
            </div>
          </div>
        ) : (
          /* Chat Interface */
          <>
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto">
              <MessageList messages={messages} isLoading={isLoading} streamingText={streamingText} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-700 bg-gray-900 p-4">
              <div className="max-w-4xl mx-auto">
                {/* Mode Toggle */}
                <div className="mb-4 flex justify-center">
                  <ModeToggle mode={mode} onModeChange={onModeChange} />
                </div>
                
                <MessageInput
                  onSendMessage={onSendMessage}
                  onImageUpload={onImageUpload}
                  mode={mode}
                  disabled={isLoading}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
