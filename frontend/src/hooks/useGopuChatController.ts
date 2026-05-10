import { useRef, useEffect, useReducer, useCallback, type ChangeEvent } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { gopuReducer, initialGopuState } from "@/views/Gopu/gopuChatReducer";
import type { CreditsBalanceResponse } from "@/types/api";
import type { GopuChatMessage } from "@/types/gopu";
import { DEFAULT_MESSAGE } from "@/data/chatbot";

export function useGopuChatController() {
  const router = useRouter();
  const [state, dispatch] = useReducer(gopuReducer, initialGopuState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopAssistantSpeech = useCallback(() => {
    const current = ttsAudioRef.current;
    if (current) {
      current.pause();
      current.removeAttribute("src");
      current.load();
      ttsAudioRef.current = null;
    }
  }, []);

  /** Scroll only the chat list panel — `scrollIntoView` on the sentinel scrolls the whole document. */
  const scrollToBottom = () => {
    const el = messagesScrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      });
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const fetchCreditBalance = async () => {
    try {
      const response = await api.get<CreditsBalanceResponse>("/credits/balance");
      const data = response.data;
      dispatch({
        type: "MERGE",
        patch: {
          credits: data,
          remainingMessages: data.is_exempt
            ? "∞"
            : Math.max(0, 10 - (data.daily_count ?? 0)),
          limitReached: !data.can_chat,
        },
      });
    } catch (error: unknown) {
      console.error("Failed to fetch credits", error);
    }
  };

  const fetchUserSessions = async () => {
    try {
      const response = await api.get<{ sessions?: { id: string; title?: string; updatedAt?: string }[] }>(
        "/chat/sessions"
      );
      dispatch({ type: "SET_SESSIONS", sessions: response.data.sessions ?? [] });
    } catch (error: unknown) {
      console.error("Failed to fetch sessions", error);
    }
  };

  const loadLatestHistory = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });
      const response = await api.get<{
        session_id?: string;
        messages?: GopuChatMessage[];
      }>("/chat/history");
      if (response.data.session_id) {
        dispatch({ type: "SET_SESSION_ID", value: response.data.session_id });
        const history = response.data.messages ?? [];
        dispatch({ 
          type: "SET_MESSAGES", 
          messages: history.length > 0 ? history : [DEFAULT_MESSAGE] 
        });
      } else {
        dispatch({ type: "SET_MESSAGES", messages: [DEFAULT_MESSAGE] });
      }
    } catch (error: unknown) {
      console.error("Failed to load history", error);
      dispatch({ type: "SET_MESSAGES", messages: [DEFAULT_MESSAGE] });
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gopuChatLanguage");
      if (stored === "English" || stored === "Hindi") {
        dispatch({ type: "MERGE", patch: { language: stored } });
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("To continue with this feature please log in");
      router.push("/");
      setTimeout(() => window.dispatchEvent(new CustomEvent("openAuthModal")), 100);
      return;
    }
    const fetchData = () => {
      void fetchCreditBalance();
      void fetchUserSessions();
      void loadLatestHistory();
    };
    fetchData();
    window.addEventListener("authSuccess", fetchData);
    return () => window.removeEventListener("authSuccess", fetchData);
  }, [router]);

  useEffect(() => () => stopAssistantSpeech(), [stopAssistantSpeech]);

  const loadSessionHistory = async (sId: string) => {
    try {
      dispatch({ type: "SET_LOADING", value: true });
      dispatch({ type: "SET_SESSION_ID", value: sId });
      const response = await api.get<{ messages?: GopuChatMessage[] }>(`/chat/sessions/${sId}/history`);
      dispatch({ type: "SET_MESSAGES", messages: response.data.messages ?? [] });
    } catch (error: unknown) {
      toast.error("Failed to load session history");
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  const startNewSession = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });
      const response = await api.post<{ session_id: string }>("/chat/sessions/new");
      dispatch({ type: "SET_SESSION_ID", value: response.data.session_id });
      dispatch({ type: "SET_MESSAGES", messages: [DEFAULT_MESSAGE] });
      void fetchUserSessions();
      toast.success("New chat started");
    } catch (error: unknown) {
      toast.error("Failed to start new session");
      console.error(error);
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (state.credits && !state.credits.has_subscription) {
      toast.error("Image upload is available only with paid plans.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== "string") return;
      const parts = result.split(",");
      const base64 = parts[1] ?? "";
      dispatch({
        type: "SET_UPLOADED_IMAGE",
        value: {
          file,
          preview: result,
          base64,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      dispatch({ type: "SET_RECORDING", value: true });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      recorder.ondataavailable = (ev) => {
        audioChunks.push(ev.data);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const result = reader.result;
          if (typeof result !== "string") return;
          const base64Audio = result.split(",")[1] ?? "";
          void (async () => {
            try {
              const response = await api.post<{ text: string }>("/speech/transcribe", {
                audio_base64: base64Audio,
                language: state.language,
              });
              dispatch({ type: "SET_INPUT", value: response.data.text });
              toast.success("Voice recorded successfully");
            } catch (error: unknown) {
              toast.error("Failed to transcribe audio");
              console.error(error);
            }
          })();
        };
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      toast.success("Recording started");
    } catch (error: unknown) {
      dispatch({ type: "SET_RECORDING", value: false });
      toast.error("Microphone access denied");
      console.error(error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      dispatch({ type: "SET_RECORDING", value: false });
    }
  };

  const handleSend = async () => {
    if (!state.input.trim() && !state.uploadedImage) return;
    if (state.limitReached) return;

    stopAssistantSpeech();

    const userMessage: GopuChatMessage = {
      role: "user",
      content: state.input,
      ...(state.uploadedImage ? { image: state.uploadedImage.preview } : {}),
    };
    let messages: GopuChatMessage[] = [...state.messages, userMessage];
    dispatch({
      type: "MERGE",
      patch: { messages, isLoading: true },
    });

    try {
      const response = await api.post<{
        session_id?: string;
        limit_reached?: boolean;
        credits_warning?: boolean;
        remaining?: number;
        response: string;
      }>("/chat", {
        message: state.input,
        session_id: state.sessionId ?? "",
        image_base64: state.uploadedImage?.base64,
        language: state.language,
      });

      if (!state.sessionId && response.data.session_id) {
        dispatch({ type: "SET_SESSION_ID", value: response.data.session_id });
        void fetchUserSessions();
      }

      if (response.data.limit_reached) {
        messages = [
          ...messages,
          {
            role: "assistant",
            content: response.data.response,
            isBlocked: true,
          },
        ];
        dispatch({
          type: "MERGE",
          patch: {
            messages,
            limitReached: true,
            remainingMessages: 0,
            input: "",
            uploadedImage: null,
            isLoading: false,
          },
        });
      } else if (response.data.credits_warning) {
        messages = [
          ...messages,
          {
            role: "assistant",
            content: response.data.response,
            isWarning: true,
            remaining: response.data.remaining,
          },
        ];
        dispatch({
          type: "MERGE",
          patch: {
            messages,
            remainingMessages: response.data.remaining ?? state.remainingMessages,
            input: "",
            uploadedImage: null,
            isLoading: false,
          },
        });
      } else {
        messages = [...messages, { role: "assistant", content: response.data.response }];
        
        // Automatically synthesize and play the response audio
        try {
          const ttsResponse = await api.post<{ audio_base64: string }>("/speech/synthesize", {
            text: response.data.response,
          });
          if (ttsResponse.data.audio_base64) {
            stopAssistantSpeech();
            const audio = new Audio(ttsResponse.data.audio_base64);
            ttsAudioRef.current = audio;
            audio.addEventListener("ended", () => {
              if (ttsAudioRef.current === audio) ttsAudioRef.current = null;
            });
            await audio.play().catch((e) => console.error("Audio auto-play blocked by browser", e));
          }
        } catch (ttsError) {
          console.error("Speech synthesis failed", ttsError);
        }

        const dec =
          state.credits && !state.credits.has_subscription
            ? {
                remainingMessages:
                  typeof state.remainingMessages === "number"
                    ? Math.max(0, state.remainingMessages - 1)
                    : state.remainingMessages,
              }
            : {};
        dispatch({
          type: "MERGE",
          patch: {
            messages,
            input: "",
            uploadedImage: null,
            isLoading: false,
            ...dec,
          },
        });
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
      void fetchCreditBalance();
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 429) {
        const detail = (error.response.data as { detail?: string })?.detail;
        messages = [
          ...messages,
          {
            role: "assistant",
            content: detail ?? "You've reached your daily limit.",
            isBlocked: true,
          },
        ];
        dispatch({
          type: "MERGE",
          patch: {
            messages,
            limitReached: true,
            remainingMessages: 0,
            isLoading: false,
          },
        });
      } else {
        const detail = isAxiosError(error)
          ? (error.response?.data as { detail?: string })?.detail
          : undefined;
        toast.error(detail ?? "Failed to send message");
        dispatch({ type: "SET_LOADING", value: false });
      }
    }
  };

  const handleFAQClick = useCallback((faq: { question: string; answer: string }) => {
    dispatch({
      type: "MERGE",
      patch: {
        messages: [
          ...state.messages,
          { role: "user", content: faq.question },
          { role: "assistant", content: faq.answer },
        ],
      },
    });
  }, [state.messages]);

  return {
    state,
    dispatch,
    fileInputRef,
    messagesEndRef,
    messagesScrollRef,
    loadSessionHistory,
    startNewSession,
    handleImageUpload,
    startRecording,
    stopRecording,
    handleSend,
    handleFAQClick,
  };
}
