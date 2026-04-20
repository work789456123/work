import type { GopuChatAction, GopuChatState } from "@/types/gopu";

export const initialGopuState: GopuChatState = {
  messages: [],
  input: "",
  language: "Hindi",
  isLoading: false,
  sessionId: null,
  sessions: [],
  uploadedImage: null,
  isRecording: false,
  credits: null,
  limitReached: false,
  remainingMessages: 10,
};

export function gopuReducer(state: GopuChatState, action: GopuChatAction): GopuChatState {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, input: action.value };
    case "SET_LOADING":
      return { ...state, isLoading: action.value };
    case "SET_MESSAGES":
      return { ...state, messages: action.messages };
    case "APPEND_MESSAGE":
      return { ...state, messages: [...state.messages, action.message] };
    case "SET_SESSION_ID":
      return { ...state, sessionId: action.value };
    case "SET_SESSIONS":
      return { ...state, sessions: action.sessions };
    case "SET_UPLOADED_IMAGE":
      return { ...state, uploadedImage: action.value };
    case "SET_RECORDING":
      return { ...state, isRecording: action.value };
    case "SET_CREDITS":
      return { ...state, credits: action.value };
    case "SET_LIMIT":
      return {
        ...state,
        limitReached: action.limitReached,
        remainingMessages: action.remainingMessages,
      };
    case "RESET_AFTER_SEND":
      return {
        ...state,
        input: "",
        uploadedImage: null,
      };
    case "DECREMENT_FREE_REMAINING":
      return {
        ...state,
        remainingMessages:
          typeof state.remainingMessages === "number"
            ? Math.max(0, state.remainingMessages - 1)
            : state.remainingMessages,
      };
    case "MERGE":
      return { ...state, ...action.patch };
    default:
      return state;
  }
}
