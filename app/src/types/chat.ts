export interface MessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  type: "text" | "image";
  imageUrl?: string;
  timestamp: Date;
}

export type ChatMode = "text" | "image";
