"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Image as ImageIcon } from "lucide-react";
import { ChatMode } from "@/types/chat";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  mode: ChatMode;
  disabled: boolean;
}

export function MessageInput({ onSendMessage, mode, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted, message:", message, "disabled:", disabled);
    if (message.trim() && !disabled) {
      console.log("Calling onSendMessage with:", message.trim());
      onSendMessage(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const placeholder = mode === "text" 
    ? "Message ChatGPT..." 
    : "Describe the image you want to generate...";

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full min-h-[44px] max-h-32 px-4 py-3 pr-12 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-background text-foreground placeholder:text-muted-foreground"
          rows={1}
        />
        <div className="absolute right-2 bottom-2">
          {mode === "image" && (
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={!message.trim() || disabled}
        size="sm"
        className="h-11 px-4"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
