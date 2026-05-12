import type { ChangeEvent, RefObject } from "react";
import type { CreditsBalanceResponse } from "@/types/api";

export type GopuChatRole = "user" | "assistant" | "system";

export type GopuUploadedImage = {
  file: File;
  preview: string;
  base64: string;
} | null;

export type GopuChatMessage = {
  id?: string;
  role: GopuChatRole;
  content: string;
  createdAt?: string;
  image?: string;
  isBlocked?: boolean;
  isWarning?: boolean;
  isWelcome?: boolean;
  remaining?: number;
};

export type GopuSession = {
  id: string;
  title?: string;
  updatedAt?: string;
  updated_at?: string;
  created_at?: string;
};

export type PetBasic = {
  id: string;
  name: string;
  pet_type: string;
  age?: string | null;
  gender?: string | null;
  weight?: string | null;
};

export type GopuChatState = {
  messages: GopuChatMessage[];
  input: string;
  language: string;
  isLoading: boolean;
  sessionId: string | null;
  sessions: GopuSession[];
  uploadedImage: GopuUploadedImage;
  isRecording: boolean;
  credits: CreditsBalanceResponse | null;
  limitReached: boolean;
  remainingMessages: number | "∞";
};

export type GopuChatAction =
  | { type: "SET_INPUT"; value: string }
  | { type: "SET_LOADING"; value: boolean }
  | { type: "SET_MESSAGES"; messages: GopuChatMessage[] }
  | { type: "APPEND_MESSAGE"; message: GopuChatMessage }
  | { type: "SET_SESSION_ID"; value: string | null }
  | { type: "SET_SESSIONS"; sessions: GopuSession[] }
  | { type: "SET_UPLOADED_IMAGE"; value: GopuUploadedImage }
  | { type: "SET_RECORDING"; value: boolean }
  | { type: "SET_CREDITS"; value: CreditsBalanceResponse | null }
  | { type: "SET_LIMIT"; limitReached: boolean; remainingMessages: number }
  | { type: "RESET_AFTER_SEND" }
  | { type: "DECREMENT_FREE_REMAINING" }
  | { type: "MERGE"; patch: Partial<GopuChatState> };

export type GopuChatInputFooterProps = {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  uploadedImage: GopuUploadedImage;
  onClearImage: () => void;
  limitReached: boolean;
  isLoading: boolean;
  isRecording: boolean;
  onPickImage: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleRecord: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
};

export type GopuChatHeaderBarProps = {
  credits: CreditsBalanceResponse | null;
  remainingMessages: number | "∞";
  mobileSidebarOpen: boolean;
  onToggleMobileSidebar: () => void;
  language?: string;
  onLanguageChange?: (lang: string) => void;
};

export type GopuChatMessageListProps = {
  messages: GopuChatMessage[];
  isLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  messagesScrollRef: RefObject<HTMLDivElement | null>;
  onFAQClick?: (faq: { question: string; answer: string }) => void;
};

export type GopuChatSidebarProps = {
  sessions: GopuSession[];
  sessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  isMobileOpen: boolean;
  onRequestCloseMobile: () => void;
};
