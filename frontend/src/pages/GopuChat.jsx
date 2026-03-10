import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, Mic, Send, Loader2, X, MicOff, CreditCard, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";

const GopuChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [credits, setCredits] = useState(null);
  const [limitReached, setLimitReached] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState(10);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchCreditBalance();
  }, []);

  const fetchCreditBalance = async () => {
    try {
      const response = await api.get("/credits/balance");
      setCredits(response.data);
      setRemainingMessages(10 - response.data.daily_count);
      setLimitReached(response.data.daily_count >= 10 && !response.data.has_subscription);
    } catch (error) {
      console.error("Failed to fetch credits", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if user has subscription for image uploads
      if (credits && !credits.has_subscription) {
        toast.error("Image upload is available only with paid plans. Explore PashuCare Suraksha Plan!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage({
          file: file,
          preview: reader.result,
          base64: reader.result.split(',')[1]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result.split(',')[1];
          try {
            const response = await api.post("/speech/transcribe", {
              audio_base64: base64Audio
            });
            const transcribedText = response.data.text;
            toast.success("Voice recorded successfully");
            // Auto-send the transcribed text
            handleSend(transcribedText);
          } catch (error) {
            toast.error("Failed to transcribe audio");
          }
        };
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      toast.success("Recording started");
    } catch (error) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleSend = async (autoSendText = null) => {
    const textToSend = autoSendText || input;
    if (!textToSend.trim() && !uploadedImage) return;
    if (limitReached) return;

    const userMessage = {
      role: "user",
      content: textToSend,
      image: uploadedImage?.preview
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.post("/chat", {
        message: textToSend,
        session_id: sessionId,
        image_base64: uploadedImage?.base64
      });

      // Check for limit reached
      if (response.data.limit_reached) {
        setLimitReached(true);
        setRemainingMessages(0);
        const blockMessage = {
          role: "assistant",
          content: response.data.response,
          isBlocked: true
        };
        setMessages(prev => [...prev, blockMessage]);
      } else if (response.data.credits_warning) {
        // Show warning message
        setRemainingMessages(response.data.remaining);
        const warningMessage = {
          role: "assistant",
          content: response.data.response,
          isWarning: true,
          remaining: response.data.remaining
        };
        setMessages(prev => [...prev, warningMessage]);
      } else {
        // Normal response
        const botMessage = {
          role: "assistant",
          content: response.data.response
        };
        setMessages(prev => [...prev, botMessage]);

        // Synthesize and play audio for the bot's response
        try {
          const ttsResponse = await api.post("/speech/synthesize", {
            text: response.data.response
          });
          const audio = new Audio(`data:audio/mp3;base64,${ttsResponse.data.audio_base64}`);
          audio.play();
        } catch (ttsError) {
          console.error("Failed to play audio response", ttsError);
        }

        // Update remaining count
        if (credits && !credits.has_subscription) {
          setRemainingMessages(prev => Math.max(0, prev - 1));
        }
      }

      setInput("");
      setUploadedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Refresh credit balance
      fetchCreditBalance();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12" data-testid="gopu-chat-page">
      <div className="max-w-4xl mx-auto px-6">
        {/* Gopu Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-white border-4 border-[#1F6559]/20 shadow-lg" style={{ borderRadius: '50%' }}>
            <img
              src="https://customer-assets.emergentagent.com/job_73651be8-bbea-4eee-a6be-0162100b6ac1/artifacts/mumll039_Gopu%20Ai%20Image.png"
              alt="Gopu AI"
              className="w-full h-full object-cover"
              data-testid="gopu-avatar"
            />
          </div>
          <h1 className="heading-font text-4xl font-bold text-[#111111]" data-testid="gopu-title">Gopu.AI</h1>
          <p className="text-[#6F6F6F]">Your pet's intelligent health companion</p>

          {/* Credit Balance Display */}
          {credits && (
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${credits.has_subscription
              ? 'bg-green-50 border-green-300'
              : remainingMessages <= 2
                ? 'bg-red-50 border-red-300'
                : 'bg-white border-[#EAEAEA]'
              }`}>
              <CreditCard className={`w-4 h-4 ${credits.has_subscription ? 'text-green-600' : remainingMessages <= 2 ? 'text-red-600' : 'text-[#1F6559]'}`} />
              <span className={`text-sm font-medium ${credits.has_subscription ? 'text-green-700' : remainingMessages <= 2 ? 'text-red-700' : 'text-[#111111]'}`}>
                {credits.has_subscription
                  ? "Unlimited Messages"
                  : `${remainingMessages} free messages remaining today`
                }
              </span>
            </div>
          )}
        </div>

        {/* Chat Container */}
        <Card className="p-6 rounded-2xl border-[#EAEAEA] space-y-6 shadow-sm bg-white" data-testid="chat-container">
          {/* Messages Area */}
          <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-center py-12 text-[#6F6F6F]">
                <p className="text-lg">Hi! I'm Gopu, your caring veterinary assistant.</p>
                <p className="text-sm mt-2">How can I help your pet today?</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.role === 'user'
                  ? 'bg-[#1F6559] text-white rounded-2xl rounded-br-sm'
                  : msg.isBlocked
                    ? 'bg-red-50 border-2 border-red-200 rounded-2xl rounded-bl-sm text-[#111111]'
                    : msg.isWarning
                      ? 'bg-yellow-50 border-2 border-yellow-200 rounded-2xl rounded-bl-sm text-[#111111]'
                      : 'bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-sm text-[#111111]'
                  } p-4 shadow-sm`}>
                  {msg.image && (
                    <div className="mb-3">
                      <img src={msg.image} alt="Uploaded" className="rounded-lg max-w-full h-auto" />
                    </div>
                  )}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                  {msg.isWarning && (
                    <div className="mt-3 pt-3 border-t border-yellow-200 flex items-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                      <p className="text-xs text-yellow-700 font-medium">{msg.remaining} messages remaining</p>
                    </div>
                  )}
                  {msg.isBlocked && (
                    <div className="mt-4 space-y-3">
                      <Button
                        onClick={() => navigate('/pashucare-suraksha-plan')}
                        className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#184F46]"
                      >
                        Buy Credits - Explore PashuCare Suraksha Plan
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#1F6559]" />
                  <span className="text-sm text-[#6F6F6F]">Gopu is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Image Preview */}
          {uploadedImage && (
            <div className="relative inline-block">
              <img src={uploadedImage.preview} alt="Preview" className="h-20 rounded-lg border border-[#EAEAEA]" />
              <button
                onClick={() => setUploadedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Limit Reached Banner */}
          {limitReached && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-700 font-medium mb-2">0 chat remaining</p>
              <p className="text-red-600 text-sm mb-3">Please buy chat credit to continue</p>
              <Button
                onClick={() => navigate('/pashucare-suraksha-plan')}
                className="rounded-full bg-red-600 text-white hover:bg-red-700"
              >
                Explore PashuCare Suraksha Plan
              </Button>
            </div>
          )}

          {/* Input Area */}
          <div className="space-y-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={limitReached ? "Daily limit reached. Buy credits to continue..." : "Describe your pet's symptoms in detail..."}
              data-testid="chat-input"
              disabled={limitReached}
              className={`min-h-[100px] rounded-xl border-[#EAEAEA] resize-none focus:border-[#1F6559] focus:ring-[#1F6559] bg-white text-[#111111] ${limitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !limitReached) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <div className="flex items-center space-x-3">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                data-testid="image-upload-input"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={limitReached || (credits && !credits.has_subscription)}
                data-testid="upload-image-button"
                className={`rounded-full border-[#EAEAEA] hover:bg-[#1F6559]/5 hover:border-[#1F6559] ${(credits && !credits.has_subscription) ? 'opacity-50' : ''}`}
                title={credits && !credits.has_subscription ? "Image upload requires paid plan" : "Upload image"}
              >
                <Upload className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={limitReached}
                data-testid="voice-input-button"
                className={`rounded-full border-[#EAEAEA] hover:bg-[#1F6559]/5 hover:border-[#1F6559] ${isRecording ? 'bg-red-50 border-red-300' : ''}`}
              >
                {isRecording ? <MicOff className="w-5 h-5 text-red-500 animate-pulse" /> : <Mic className="w-5 h-5" />}
              </Button>
              <Button
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && !uploadedImage) || limitReached}
                data-testid="send-message-button"
                className="flex-1 rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] disabled:bg-gray-300"
              >
                <Send className="w-5 h-5 mr-2" />
                Send
              </Button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-[#6F6F6F] text-center p-4 bg-[#FAFAFA] rounded-xl border border-[#EAEAEA]">
            <p><strong>Disclaimer:</strong> This is advisory guidance. Please consult a veterinarian for treatment.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GopuChat;
