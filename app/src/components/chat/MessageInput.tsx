"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  Image as ImageIcon, 
  Upload
} from "lucide-react";
import { ChatMode } from "@/types/chat";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onImageUpload?: (file: File) => void;
  mode: ChatMode;
  disabled: boolean;
                          }

export function MessageInput({ 
  onSendMessage, 
  onImageUpload, 
  mode, 
  disabled
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      onImageUpload(file);
      // Reset the input
      e.target.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const placeholder = mode === "text" 
    ? "Ask anything" 
    : "Describe the image you want to generate...";


  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1 relative">

          {/* Input Bar */}
          <div className="relative flex items-center bg-gray-800 border border-gray-600 rounded-lg focus-within:border-gray-500 transition-colors">

            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="flex-1 min-h-[44px] max-h-32 px-3 py-3 bg-transparent text-white placeholder:text-gray-400 resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
            />

          </div>
        </div>
      </form>
      
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
