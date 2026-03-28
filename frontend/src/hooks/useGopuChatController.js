import { useRef, useEffect, useReducer } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { gopuReducer, initialGopuState } from "@/pages/user/Gopu/gopuChatReducer";

export function useGopuChatController() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(gopuReducer, initialGopuState);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const fetchCreditBalance = async () => {
    try {
      const response = await api.get("/credits/balance");
      dispatch({
        type: "MERGE",
        patch: {
          credits: response.data,
          remainingMessages: response.data.is_exempt
            ? "∞"
            : Math.max(0, 10 - response.data.daily_count),
          limitReached: !response.data.can_chat,
        },
      });
    } catch (error) {
      console.error("Failed to fetch credits", error);
    }
  };

  const fetchUserSessions = async () => {
    try {
      const response = await api.get("/chat/sessions");
      dispatch({ type: "SET_SESSIONS", sessions: response.data.sessions || [] });
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    }
  };

  const loadLatestHistory = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });
      const response = await api.get("/chat/history");
      if (response.data.session_id) {
        dispatch({ type: "SET_SESSION_ID", value: response.data.session_id });
        dispatch({ type: "SET_MESSAGES", messages: response.data.messages || [] });
      }
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("To continue with this feature please log in");
      navigate("/");
      setTimeout(() => window.dispatchEvent(new CustomEvent("openAuthModal")), 100);
      return;
    }
    const fetchData = () => {
      fetchCreditBalance();
      fetchUserSessions();
      loadLatestHistory();
    };
    fetchData();
    window.addEventListener("authSuccess", fetchData);
    return () => window.removeEventListener("authSuccess", fetchData);
  }, [navigate]);

  const loadSessionHistory = async (sId) => {
    try {
      dispatch({ type: "SET_LOADING", value: true });
      dispatch({ type: "SET_SESSION_ID", value: sId });
      const response = await api.get(`/chat/sessions/${sId}/history`);
      dispatch({ type: "SET_MESSAGES", messages: response.data.messages || [] });
    } catch (error) {
      toast.error("Failed to load session history");
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  const startNewSession = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });
      const response = await api.post("/chat/sessions/new");
      dispatch({ type: "SET_SESSION_ID", value: response.data.session_id });
      dispatch({ type: "SET_MESSAGES", messages: [] });
      fetchUserSessions();
      toast.success("New chat started");
    } catch (error) {
      toast.error("Failed to start new session");
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
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
      dispatch({
        type: "SET_UPLOADED_IMAGE",
        value: {
          file,
          preview: reader.result,
          base64: reader.result.split(",")[1],
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];
      recorder.ondataavailable = (ev) => {
        audioChunks.push(ev.data);
      };
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result.split(",")[1];
          try {
            const response = await api.post("/speech/transcribe", {
              audio_base64: base64Audio,
            });
            dispatch({ type: "SET_INPUT", value: response.data.text });
            toast.success("Voice recorded successfully");
          } catch (error) {
            toast.error("Failed to transcribe audio");
          }
        };
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      dispatch({ type: "SET_RECORDING", value: true });
      toast.success("Recording started");
    } catch (error) {
      toast.error("Microphone access denied");
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

    const userMessage = {
      role: "user",
      content: state.input,
      image: state.uploadedImage?.preview,
    };
    let messages = [...state.messages, userMessage];
    dispatch({
      type: "MERGE",
      patch: { messages, isLoading: true },
    });

    try {
      const response = await api.post("/chat", {
        message: state.input,
        session_id: state.sessionId || "",
        image_base64: state.uploadedImage?.base64,
      });

      if (!state.sessionId && response.data.session_id) {
        dispatch({ type: "SET_SESSION_ID", value: response.data.session_id });
        fetchUserSessions();
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
            remainingMessages: response.data.remaining,
            input: "",
            uploadedImage: null,
            isLoading: false,
          },
        });
      } else {
        messages = [
          ...messages,
          { role: "assistant", content: response.data.response },
        ];
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
      fetchCreditBalance();
    } catch (error) {
      if (error.response?.status === 429) {
        messages = [
          ...messages,
          {
            role: "assistant",
            content:
              error.response.data.detail || "You've reached your daily limit.",
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
        toast.error(error.response?.data?.detail || "Failed to send message");
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
