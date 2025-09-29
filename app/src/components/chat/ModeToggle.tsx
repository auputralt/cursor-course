"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Image as ImageIcon } from "lucide-react";
import { ChatMode } from "@/types/chat";

interface ModeToggleProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex bg-muted rounded-lg p-1">
      <Button
        variant={mode === "text" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("text")}
        className="flex items-center gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        Chat
      </Button>
      <Button
        variant={mode === "image" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("image")}
        className="flex items-center gap-2"
      >
        <ImageIcon className="w-4 h-4" />
        Image
      </Button>
    </div>
  );
}
