import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { 
  Upload, Mic, Send, Loader2, X, MicOff, 
  CreditCard, AlertTriangle, MessageSquare, Plus, Clock 
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import ReactMarkdown from 'react-markdown';

const GopuChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
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
    const fetchData = () => {
      fetchCreditBalance();
      fetchUserSessions();
      loadLatestHistory();
    };

    fetchData();

    // Listen to login/signup success events to refetch data
    window.addEventListener('authSuccess', fetchData);
    
    return () => {
      window.removeEventListener('authSuccess', fetchData);
    };
  }, []);

  const fetchCreditBalance = async () => {
    try {
      const response = await api.get("/credits/balance");
      setCredits(response.data);
      setRemainingMessages(response.data.is_exempt ? "∞" : Math.max(0, 10 - response.data.daily_count));
      setLimitReached(!response.data.can_chat);
    } catch (error) {
      console.error("Failed to fetch credits", error);
    }
  };

  const fetchUserSessions = async () => {
    try {
      const response = await api.get("/chat/sessions");
      setSessions(response.data.sessions || []);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    }
  };

  const loadLatestHistory = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/chat/history");
      if (response.data.session_id) {
        setSessionId(response.data.session_id);
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSessionHistory = async (sId) => {
    try {
      setIsLoading(true);
      setSessionId(sId);
      const response = await api.get(`/chat/sessions/${sId}/history`);
      setMessages(response.data.messages || []);
    } catch (error) {
      toast.error("Failed to load session history");
    } finally {
      setIsLoading(false);
    }
  };

  const startNewSession = async () => {
    try {
      setIsLoading(true);
      const response = await api.post("/chat/sessions/new");
      setSessionId(response.data.session_id);
      setMessages([]);
      fetchUserSessions();
      toast.success("New chat started");
    } catch (error) {
      toast.error("Failed to start new session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (credits && !credits.has_subscription) {
        toast.error("Image upload is available only with paid plans.");
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
            setInput(response.data.text);
            toast.success("Voice recorded successfully");
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

  const handleSend = async () => {
    if (!input.trim() && !uploadedImage) return;
    if (limitReached) return;

    const userMessage = { 
      role: "user", 
      content: input, 
      image: uploadedImage?.preview
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.post("/chat", {
        message: input,
        session_id: sessionId || "",
        image_base64: uploadedImage?.base64
      });

      // Update session ID if it was null (first message)
      if (!sessionId && response.data.session_id) {
        setSessionId(response.data.session_id);
        fetchUserSessions();
      }

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
        setRemainingMessages(response.data.remaining);
        const warningMessage = {
          role: "assistant",
          content: response.data.response,
          isWarning: true,
          remaining: response.data.remaining
        };
        setMessages(prev => [...prev, warningMessage]);
      } else {
        const botMessage = {
          role: "assistant",
          content: response.data.response
        };
        setMessages(prev => [...prev, botMessage]);
        if (credits && !credits.has_subscription) {
          setRemainingMessages(prev => Math.max(0, prev - 1));
        }
      }

      setInput("");
      setUploadedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchCreditBalance();
    } catch (error) {
      if (error.response?.status === 429) {
        setLimitReached(true);
        setRemainingMessages(0);
        const blockMessage = {
          role: "assistant",
          content: error.response.data.detail || "You've reached your daily limit.",
          isBlocked: true
        };
        setMessages(prev => [...prev, blockMessage]);
      } else {
        toast.error(error.response?.data?.detail || "Failed to send message");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FAFAFA]" data-testid="gopu-chat-page">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex w-80 bg-white border-r border-[#EAEAEA] flex-col p-6 space-y-6">
        <Button 
          onClick={startNewSession}
          className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] flex items-center justify-center gap-2 py-6"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </Button>

        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center gap-2 text-[#6F6F6F] px-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Recent History</span>
          </div>
          
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-[#9F9F9F] text-sm">
              No recent chats
            </div>
          ) : (
            <div className="space-y-1">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => loadSessionHistory(session.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${
                    sessionId === session.id 
                      ? 'bg-[#1F6559]/5 border border-[#1F6559]/20 text-[#1F6559]' 
                      : 'hover:bg-gray-50 text-[#6F6F6F]'
                  }`}
                >
                  <MessageSquare className={`w-4 h-4 mt-1 ${sessionId === session.id ? 'text-[#1F6559]' : 'text-[#9F9F9F]'}`} />
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium truncate">Chat Session</p>
                    <p className="text-[10px] opacity-60">
                      {new Date(session.created_at).toLocaleDateString()} at {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center py-8 px-4 lg:py-12 lg:px-6 overflow-hidden">
        <div className="w-full max-w-3xl flex flex-col h-full bg-white rounded-3xl shadow-sm border border-[#EAEAEA] overflow-hidden">
          
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-[#EAEAEA] flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#1F6559]/20">
                <video src="/gopuhivideo2.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-bold text-[#111111]">Gopu.AI</h2>
                <p className="text-xs text-[#6F6F6F]">Pet Health Companion</p>
              </div>
            </div>

            {credits && (
              <div className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
                credits.has_subscription ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-[#111111]'
              }`}>
                <CreditCard className="w-3.5 h-3.5" />
                <span>{credits.has_subscription ? "Unlimited" : `${remainingMessages} Left`}</span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
            {messages.length === 0 && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                <div className="w-20 h-20 bg-[#1F6559]/5 rounded-3xl flex items-center justify-center transform rotate-12">
                  <MessageSquare className="w-10 h-10 text-[#1F6559]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">Start a conversation</h3>
                  <p className="text-sm text-[#6F6F6F] max-w-xs mx-auto">Ask anything about your pet's health or behavior.</p>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-[#1F6559] text-white rounded-tr-sm' 
                    : msg.isBlocked
                      ? 'bg-red-50 border-2 border-red-200 text-[#111111] rounded-tl-sm shadow-sm'
                      : msg.isWarning
                        ? 'bg-yellow-50 border-2 border-yellow-200 text-[#111111] rounded-tl-sm shadow-sm'
                        : 'bg-[#FAFAFA] border border-[#EAEAEA] text-[#111111] rounded-tl-sm'
                }`}>
                  {msg.image && (
                    <img src={msg.image} alt="Upload" className="rounded-lg mb-2 max-h-48" />
                  )}
                  {msg.role === 'user' ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:leading-relaxed prose-p:my-0 prose-pre:my-0">
                      <ReactMarkdown 
                        components={{
                          p: ({node, ...props}) => <p className="mb-0 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc ml-4 my-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal ml-4 my-2" {...props} />,
                          li: ({node, ...props}) => <li className="my-1" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-[#111111]" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                  
                  {msg.isWarning && (
                    <div className="mt-3 pt-3 border-t border-yellow-200 flex items-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                      <p className="text-xs text-yellow-700 font-medium">{msg.remaining} messages remaining</p>
                    </div>
                  )}

                  {msg.isBlocked && (
                    <div className="mt-4 pt-4 border-t border-red-200 space-y-3">
                       <Button
                        onClick={() => navigate('/pashucare-suraksha-plan')}
                        className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] py-5 shadow-md flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Explore PashuCare Suraksha Plan
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#FAFAFA] border border-[#EAEAEA] p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#1F6559]" />
                  <span className="text-xs text-[#6F6F6F]">Gopu is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-4 lg:p-6 border-t border-[#EAEAEA] bg-white">
            {uploadedImage && (
              <div className="mb-3 relative inline-block">
                <img src={uploadedImage.preview} className="h-20 w-20 object-cover rounded-lg border" />
                <button onClick={() => setUploadedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="w-3 h-3" /></button>
              </div>
            )}

            {/* Limit Reached Banner */}
            {limitReached && (
              <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center animate-in fade-in slide-in-from-bottom-2">
                <p className="text-red-700 font-bold mb-1">Daily Limit Reached</p>
                <p className="text-red-600 text-xs mb-3">You've used your 10 free messages for today.</p>
                <Button
                  onClick={() => navigate('/pashucare-suraksha-plan')}
                  className="w-full rounded-full bg-red-600 text-white hover:bg-red-700 shadow-sm"
                >
                  Buy Credits / Explore Plans
                </Button>
              </div>
            )}
            
            <div className={`relative ${limitReached ? 'opacity-50 pointer-events-none' : ''}`}>
              <Textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={limitReached}
                placeholder={limitReached ? "Limit reached for today..." : "Ask Gopu anything..."}
                className="min-h-[60px] max-h-[150px] pr-28 rounded-2xl border-[#EAEAEA] focus:border-[#1F6559] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !limitReached) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={limitReached}
                  className="text-[#6F6F6F] hover:text-[#1F6559]"
                >
                  <Upload className="w-5 h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={isRecording ? stopRecording : startRecording} 
                  disabled={limitReached}
                  className={isRecording ? 'text-red-500 animate-pulse' : 'text-[#6F6F6F]'}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Button 
                  onClick={handleSend}
                  disabled={isLoading || (!input.trim() && !uploadedImage) || limitReached}
                  className="bg-[#1F6559] hover:bg-[#184F46] text-white rounded-xl px-4 h-9"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-[10px] text-center text-[#9F9F9F] mt-3">Gopu.AI can provide health advice but always consult a vet for emergencies.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GopuChat;
