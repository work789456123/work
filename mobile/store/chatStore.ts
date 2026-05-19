import { create } from 'zustand';
import api from '@/lib/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  severity?: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  title: string | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  creditsRemaining: number | null;
  remaining: number | null;
  creditsWarning: boolean;

  fetchSessions: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  createSession: () => Promise<string>;
  deleteSession: (sessionId: string) => Promise<void>;
  sendMessage: (message: string, imageBase64?: string, petId?: string, language?: string) => Promise<void>;
  clearCurrentSession: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  currentSessionId: null,
  messages: [],
  isLoading: false,
  isSending: false,
  creditsRemaining: null,
  remaining: null,
  creditsWarning: false,

  fetchSessions: async () => {
    const res = await api.get('/api/chat/sessions');
    set({ sessions: res.data.sessions });
  },

  loadSession: async (sessionId) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/api/chat/sessions/${sessionId}/history`);
      set({
        currentSessionId: sessionId,
        messages: res.data.messages,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createSession: async () => {
    const res = await api.post('/api/chat/sessions/new');
    const newSession: ChatSession = {
      id: res.data.session_id,
      title: res.data.title,
      summary: null,
      created_at: res.data.created_at,
      updated_at: res.data.created_at,
    };
    set((state) => ({ sessions: [newSession, ...state.sessions] }));
    return res.data.session_id;
  },

  deleteSession: async (sessionId) => {
    await api.delete(`/api/chat/sessions/${sessionId}`);
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== sessionId),
      currentSessionId:
        state.currentSessionId === sessionId ? null : state.currentSessionId,
      messages: state.currentSessionId === sessionId ? [] : state.messages,
    }));
  },

  sendMessage: async (message, imageBase64, petId, language = 'Hindi') => {
    const { currentSessionId } = get();

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
    };
    set((state) => ({
      messages: [...state.messages, tempUserMsg],
      isSending: true,
    }));

    try {
      const res = await api.post('/api/chat', {
        message,
        session_id: currentSessionId,
        image_base64: imageBase64 || null,
        pet_id: petId || null,
        language,
      });

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.data.response,
        severity: res.data.severity,
        created_at: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMsg],
        currentSessionId: res.data.session_id,
        creditsRemaining: res.data.credits_remaining,
        remaining: res.data.remaining,
        creditsWarning: res.data.credits_warning,
      }));

      // Update session title in list
      if (res.data.session_title) {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === res.data.session_id
              ? { ...s, title: res.data.session_title }
              : s
          ),
        }));
      }
    } catch (error: any) {
      // Remove optimistic message on failure
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== tempUserMsg.id),
      }));
      throw error;
    } finally {
      set({ isSending: false });
    }
  },

  clearCurrentSession: () => {
    set({ currentSessionId: null, messages: [] });
  },
}));
