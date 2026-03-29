import { useRef, useEffect, useReducer, type ChangeEvent } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { gopuReducer, initialGopuState } from "@/views/Gopu/gopuChatReducer";
import type { CreditsBalanceResponse } from "@/types/api";
import type { GopuChatMessage } from "@/types/gopu";

export function useGopuChatController() {
  const router = useRouter();
  const [state, dispatch] = useReducer(gopuReducer, initialGopuState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        dispatch({ type: "SET_MESSAGES", messages: response.data.messages ?? [] });
      }
    } catch (error: unknown) {
      console.error("Failed to load history", error);
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

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
      dispatch({ type: "SET_MESSAGES", messages: [] });
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
      dispatch({ type: "SET_RECORDING", value: true });
      toast.success("Recording started");
    } catch (error: unknown) {
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

  return {
    state,
    dispatch,
    fileInputRef,
    messagesEndRef,
    loadSessionHistory,
    startNewSession,
    handleImageUpload,
    startRecording,
    stopRecording,
    handleSend,
  };
}
