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
  remaining?: number;
};

export type GopuSession = {
  id: string;
  title?: string;
  updatedAt?: string;
  created_at?: string;
};

export type GopuChatState = {
  messages: GopuChatMessage[];
  input: string;
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
  | {
      type: "SET_LIMIT";
      limitReached: boolean;
      remainingMessages: number;
    }
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
};

export type GopuChatMessageListProps = {
  messages: GopuChatMessage[];
  isLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  /** Scrollable message list container — scroll this instead of using scrollIntoView (avoids scrolling the page). */
  messagesScrollRef: RefObject<HTMLDivElement | null>;
};

export type GopuChatSidebarProps = {
  sessions: GopuSession[];
  sessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  /** When false on viewports below lg, sidebar is off-canvas; lg+ ignores this for layout. */
  isMobileOpen: boolean;
  onRequestCloseMobile: () => void;
};
