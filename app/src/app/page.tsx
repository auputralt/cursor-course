"use client";
import React, { useState, useCallback } from "react";
import { ChatLayout } from "@/components/chat/ChatLayout";
import { MessageData, ChatMode } from "@/types/chat";
import { useOpenAI } from "@/hooks/useOpenAI";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/button";

export default function ChatDemoPage() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [mode, setMode] = useState<ChatMode>("text");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isLoading, error, sendMessage, clearError } = useOpenAI();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    console.log("Sending message:", message, "in mode:", mode);
    
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
      mode,
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
          if (lastMessage && lastMessage.role === 'assistant' && mode === 'text') {
            // Update the existing message only for text mode streaming
            Object.assign(lastMessage, aiMessage);
          } else {
            // Add as new message for image mode or if no existing assistant message
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

  const handleImageUpload = useCallback((file: File) => {
    // Convert file to data URL for display
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      // Add user message with uploaded image
      const userMessage: MessageData = {
        id: crypto.randomUUID(),
        role: "user",
        content: `Uploaded image: ${file.name}`,
        type: "image",
        imageUrl: imageUrl,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
    };
    reader.readAsDataURL(file);
  }, []);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to AI Chat
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to start chatting with our AI assistant.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => setShowAuthModal(true)}
              className="w-full"
            >
              Sign In
            </Button>
            <Button
              onClick={() => setShowAuthModal(true)}
              variant="outline"
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with user menu */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              AI Chat Assistant
            </h1>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main chat interface */}
      <ChatLayout
        messages={messages}
        onSendMessage={handleSendMessage}
        onImageUpload={handleImageUpload}
        onNewChat={handleNewChat}
        mode={mode}
        onModeChange={handleModeChange}
        isLoading={isLoading}
      />
    </div>
  );
}
