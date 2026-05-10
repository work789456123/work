import { useRef, useEffect, useReducer, useCallback, type ChangeEvent } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import type { GopuChatMessage, GopuSession, PetBasic } from "@/types/gopu";
import { gopuReducer, initialGopuState } from "@/views/Gopu/gopuChatReducer";
import type { CreditsBalanceResponse } from "@/types/api";

// --------------------------------------------------------------------------
// Extra state layered on top of the base chat state
// --------------------------------------------------------------------------
type MedicalExtra = {
  pets: PetBasic[];
  petsLoading: boolean;
  selectedPet: PetBasic | null;
  petConfirmed: boolean;
  /** null = not yet shown; "pending" = bar visible; "resolved" | "unresolved" = done */
  resolutionState: null | "pending" | "resolved" | "unresolved";
};

const medicalExtraInitial: MedicalExtra = {
  pets: [],
  petsLoading: true,
  selectedPet: null,
  petConfirmed: false,
  resolutionState: null,
};

const PET_EMOJI: Record<string, string> = {
  dog: "🐕", cat: "🐈", cow: "🐄", buffalo: "🐃", goat: "🐐",
  sheep: "🐑", horse: "🐴", rabbit: "🐇", bird: "🦜", fish: "🐟",
  poultry: "🐓", pig: "🐷",
};
function petEmoji(type: string) { return PET_EMOJI[type.toLowerCase()] ?? "🐾"; }

// --------------------------------------------------------------------------
// Controller
// --------------------------------------------------------------------------
export function useGopuMedicalController() {
  const router = useRouter();
  const [state, dispatch] = useReducer(gopuReducer, {
    ...initialGopuState,
    messages: [],
  });
  const [extra, setExtra] = useReducer(
    (s: MedicalExtra, patch: Partial<MedicalExtra>) => ({ ...s, ...patch }),
    medicalExtraInitial,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopAssistantSpeech = useCallback(() => {
    const cur = ttsAudioRef.current;
    if (cur) { cur.pause(); cur.removeAttribute("src"); cur.load(); ttsAudioRef.current = null; }
  }, []);

  const scrollToBottom = () => {
    const el = messagesScrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => requestAnimationFrame(() => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })));
  };

  useEffect(() => { scrollToBottom(); }, [state.messages]);

  // ------------------------------------------------------------------
  // Fetch user data on mount
  // ------------------------------------------------------------------
  const fetchCreditBalance = async () => {
    try {
      const res = await api.get<CreditsBalanceResponse>("/credits/balance");
      const data = res.data;
      dispatch({
        type: "MERGE",
        patch: {
          credits: data,
          remainingMessages: data.is_exempt ? "∞" : Math.max(0, 10 - (data.daily_count ?? 0)),
          limitReached: !data.can_chat,
        },
      });
    } catch { /* silent */ }
  };

  const fetchUserSessions = async () => {
    try {
      const res = await api.get<{ sessions?: GopuSession[] }>("/chat/sessions");
      dispatch({ type: "SET_SESSIONS", sessions: res.data.sessions ?? [] });
    } catch { /* silent */ }
  };

  const fetchPets = async () => {
    try {
      const res = await api.get<PetBasic[]>("/pets");
      setExtra({ pets: res.data ?? [], petsLoading: false });
    } catch {
      setExtra({ pets: [], petsLoading: false });
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gopuChatLanguage");
      if (stored === "English" || stored === "Hindi") dispatch({ type: "MERGE", patch: { language: stored } });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("To continue with this feature please log in");
      router.push("/");
      setTimeout(() => window.dispatchEvent(new CustomEvent("openAuthModal")), 100);
      return;
    }
    void fetchCreditBalance();
    void fetchUserSessions();
    void fetchPets();

    const handleAuth = () => { void fetchCreditBalance(); void fetchUserSessions(); void fetchPets(); };
    window.addEventListener("authSuccess", handleAuth);
    return () => window.removeEventListener("authSuccess", handleAuth);
  }, [router]);

  useEffect(() => () => stopAssistantSpeech(), [stopAssistantSpeech]);

  // ------------------------------------------------------------------
  // Session helpers
  // ------------------------------------------------------------------
  const loadSessionHistory = async (sId: string) => {
    try {
      dispatch({ type: "SET_LOADING", value: true });
      dispatch({ type: "SET_SESSION_ID", value: sId });
      const res = await api.get<{ messages?: GopuChatMessage[] }>(`/chat/sessions/${sId}/history`);
      const msgs = res.data.messages ?? [];
      dispatch({ type: "SET_MESSAGES", messages: msgs.length > 0 ? msgs : [] });
      // Pet is not re-selected when loading history; hide selector
      setExtra({ petConfirmed: msgs.length > 0, resolutionState: null });
    } catch { toast.error("Failed to load session history"); }
    finally { dispatch({ type: "SET_LOADING", value: false }); }
  };

  const startNewSession = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });
      const res = await api.post<{ session_id: string }>("/chat/sessions/new");
      dispatch({ type: "SET_SESSION_ID", value: res.data.session_id });
      dispatch({ type: "SET_MESSAGES", messages: [] });
      setExtra({ petConfirmed: false, selectedPet: null, resolutionState: null });
      void fetchUserSessions();
      toast.success("New chat started");
    } catch { toast.error("Failed to start new session"); }
    finally { dispatch({ type: "SET_LOADING", value: false }); }
  };

  // ------------------------------------------------------------------
  // Pet selection
  // ------------------------------------------------------------------
  const handlePetSelect = useCallback((pet: PetBasic) => {
    setExtra({ selectedPet: pet, petConfirmed: true, resolutionState: null });

    // Instant local greeting — no API call, appears immediately
    const emoji = pet.id ? petEmoji(pet.pet_type) : "🐾";
    const greeting = pet.id
      ? `${emoji} Got it! I'll be helping with **${pet.name}** — ${pet.pet_type}${pet.age ? `, ${pet.age}` : ""}${pet.gender ? `, ${pet.gender}` : ""}. What seems to be the issue today?`
      : "🐾 Sure! Please describe your pet and their issue, and I'll do my best to help.";

    dispatch({
      type: "MERGE",
      patch: { messages: [{ role: "assistant", content: greeting }] },
    });
  }, []);

  // ------------------------------------------------------------------
  // Resolution flow
  // ------------------------------------------------------------------
  // Use a ref so handleResolved always sees the current selectedPet without re-creating on every pet change
  const selectedPetRef = useRef<PetBasic | null>(null);
  selectedPetRef.current = extra.selectedPet;

  const handleResolved = useCallback(() => {
    setExtra({ resolutionState: "resolved" });
    const petName = selectedPetRef.current?.name ?? "your pet";
    dispatch({
      type: "APPEND_MESSAGE",
      message: {
        role: "assistant",
        content: `Happy to help you! 🐾 Take good care of **${petName}**. If you ever have more questions, I'm always here.`,
      },
    });
  }, []); // stable — reads petName via ref

  const handleNeedHelp = useCallback(() => {
    setExtra({ resolutionState: "unresolved" });
    dispatch({
      type: "APPEND_MESSAGE",
      message: {
        role: "assistant",
        // sentinel value — GopuMedicalMessageList renders this as the vet referral card
        content: "__VET_REFERRAL__",
      },
    });
  }, []);

  // ------------------------------------------------------------------
  // Image upload
  // ------------------------------------------------------------------
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (state.credits && !state.credits.has_subscription) {
      toast.error("Image upload is available only with paid plans.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image size should be less than 5MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== "string") return;
      const base64 = result.split(",")[1] ?? "";
      dispatch({ type: "SET_UPLOADED_IMAGE", value: { file, preview: result, base64 } });
    };
    reader.readAsDataURL(file);
  };

  // ------------------------------------------------------------------
  // Voice recording
  // ------------------------------------------------------------------
  const startRecording = async () => {
    try {
      dispatch({ type: "SET_RECORDING", value: true });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (ev) => chunks.push(ev.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const result = reader.result;
          if (typeof result !== "string") return;
          const base64Audio = result.split(",")[1] ?? "";
          void (async () => {
            try {
              const res = await api.post<{ text: string }>("/speech/transcribe", {
                audio_base64: base64Audio,
                language: state.language,
              });
              dispatch({ type: "SET_INPUT", value: res.data.text });
              toast.success("Voice recorded successfully");
            } catch { toast.error("Failed to transcribe audio"); }
          })();
        };
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      toast.success("Recording started");
    } catch {
      dispatch({ type: "SET_RECORDING", value: false });
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

  // ------------------------------------------------------------------
  // Send message
  // ------------------------------------------------------------------
  // Ref so handleSend can read current resolution state without re-creating
  const resolutionStateRef = useRef<MedicalExtra["resolutionState"]>(null);
  resolutionStateRef.current = extra.resolutionState;

  const handleSend = async () => {
    if (!state.input.trim() && !state.uploadedImage) return;
    if (state.limitReached) return;
    // Prevent sending after conversation has been concluded
    if (resolutionStateRef.current === "resolved" || resolutionStateRef.current === "unresolved") return;

    stopAssistantSpeech();
    setExtra({ resolutionState: null }); // hide resolution bar while AI is responding

    const userMessage: GopuChatMessage = {
      role: "user",
      content: state.input,
      ...(state.uploadedImage ? { image: state.uploadedImage.preview } : {}),
    };
    let messages: GopuChatMessage[] = [...state.messages, userMessage];
    dispatch({ type: "MERGE", patch: { messages, isLoading: true } });

    try {
      const res = await api.post<{
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
        pet_id: extra.selectedPet?.id || undefined,
      });

      if (!state.sessionId && res.data.session_id) {
        dispatch({ type: "SET_SESSION_ID", value: res.data.session_id });
        void fetchUserSessions();
      }

      if (res.data.limit_reached) {
        messages = [...messages, { role: "assistant", content: res.data.response, isBlocked: true }];
        dispatch({ type: "MERGE", patch: { messages, limitReached: true, remainingMessages: 0, input: "", uploadedImage: null, isLoading: false } });
      } else if (res.data.credits_warning) {
        messages = [...messages, { role: "assistant", content: res.data.response, isWarning: true, remaining: res.data.remaining }];
        dispatch({ type: "MERGE", patch: { messages, remainingMessages: res.data.remaining ?? state.remainingMessages, input: "", uploadedImage: null, isLoading: false } });
        // Show resolution bar after warning response too
        setExtra({ resolutionState: "pending" });
      } else {
        messages = [...messages, { role: "assistant", content: res.data.response }];
        dispatch({ type: "MERGE", patch: { messages, input: "", uploadedImage: null, isLoading: false } });
        // Show resolution bar after each real AI response (medical mode)
        setExtra({ resolutionState: "pending" });

        // TTS (best-effort)
        try {
          const tts = await api.post<{ audio_base64: string }>("/speech/synthesize", { text: res.data.response });
          if (tts.data.audio_base64) {
            stopAssistantSpeech();
            const audio = new Audio(tts.data.audio_base64);
            ttsAudioRef.current = audio;
            audio.addEventListener("ended", () => { if (ttsAudioRef.current === audio) ttsAudioRef.current = null; });
            await audio.play().catch(() => { /* autoplay blocked */ });
          }
        } catch { /* TTS is non-critical */ }
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
      void fetchCreditBalance();
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 429) {
        const detail = (error.response.data as { detail?: string })?.detail;
        messages = [...messages, { role: "assistant", content: detail ?? "You've reached your daily limit.", isBlocked: true }];
        dispatch({ type: "MERGE", patch: { messages, limitReached: true, remainingMessages: 0, isLoading: false } });
      } else {
        const detail = isAxiosError(error) ? (error.response?.data as { detail?: string })?.detail : undefined;
        toast.error(detail ?? "Failed to send message");
        dispatch({ type: "SET_LOADING", value: false });
      }
    }
  };

  return {
    state,
    extra,
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
    handlePetSelect,
    handleResolved,
    handleNeedHelp,
  };
}
