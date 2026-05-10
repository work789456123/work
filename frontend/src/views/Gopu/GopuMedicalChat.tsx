"use client";

import { useCallback, useEffect, useState } from "react";
import { useGopuMedicalController } from "@/hooks/useGopuMedicalController";
import { gopuChat } from "@/assets/content/gopu";
import GopuChatSidebar from "./components/GopuChatSidebar";
import GopuChatHeaderBar from "./components/GopuChatHeaderBar";
import GopuChatInputFooter from "./components/GopuChatInputFooter";
import GopuPetSelector from "./components/GopuPetSelector";
import GopuResolutionBar from "./components/GopuResolutionBar";
import GopuMedicalMessageList from "./components/GopuMedicalMessageList";
import PawTexture from "@/components/PawTexture";
import { AlertCircle } from "lucide-react";

const GopuMedicalChat = () => {
  const {
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
  } = useGopuMedicalController();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);
  const toggleMobileSidebar = useCallback(() => setMobileSidebarOpen((o) => !o), []);

  const handleNewChat = useCallback(() => {
    startNewSession();
    closeMobileSidebar();
  }, [startNewSession, closeMobileSidebar]);

  const handleSelectSession = useCallback(
    (id: string) => { loadSessionHistory(id); closeMobileSidebar(); },
    [loadSessionHistory, closeMobileSidebar],
  );

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMobileSidebar(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileSidebarOpen, closeMobileSidebar]);

  /** Whether the resolution bar should be visible */
  const showResolutionBar =
    extra.petConfirmed &&
    extra.resolutionState === "pending" &&
    !state.isLoading &&
    state.messages.some((m) => m.role === "user"); // at least one real exchange

  /** Lock the input after final resolution */
  const inputLocked =
    state.limitReached ||
    extra.resolutionState === "resolved" ||
    extra.resolutionState === "unresolved";

  return (
    <div
      id="page-gopu-medical"
      className="flex flex-col lg:flex-row lg:justify-end min-h-screen bg-[#FAFAFA] relative"
    >
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label={gopuChat.header.closeSidebarAria}
          className="lg:hidden fixed inset-0 top-20 z-30 bg-black/40"
          onClick={closeMobileSidebar}
        />
      )}

      <GopuChatSidebar
        sessions={state.sessions}
        sessionId={state.sessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        isMobileOpen={mobileSidebarOpen}
        onRequestCloseMobile={closeMobileSidebar}
      />

      <div className="flex flex-col items-center py-8 px-4 lg:py-6 lg:px-6 lg:w-[calc(100%-20rem)] overflow-hidden relative">
        <PawTexture />
        <div className="w-full max-w-3xl flex flex-col relative bg-teal-50 rounded-3xl shadow-sm border border-[#EAEAEA] overflow-hidden">
          {/* Header with medical badge */}
          <div className="relative">
            <GopuChatHeaderBar
              credits={state.credits}
              remainingMessages={state.remainingMessages}
              mobileSidebarOpen={mobileSidebarOpen}
              onToggleMobileSidebar={toggleMobileSidebar}
              language={state.language}
              onLanguageChange={(lang) => {
                try {
                  if (lang === "English" || lang === "Hindi") localStorage.setItem("gopuChatLanguage", lang);
                } catch { /* private mode */ }
                dispatch({ type: "MERGE", patch: { language: lang } });
              }}
            />
            {/* Medical mode badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1.5 bg-red-100 text-red-600 text-[11px] font-semibold px-3 py-1 rounded-full border border-red-200 pointer-events-none">
              <AlertCircle className="w-3 h-3" />
              Medical Complaint Mode
            </div>
          </div>

          {/* Pet selector — shown before pet is confirmed */}
          {!extra.petConfirmed && (
            <GopuPetSelector
              pets={extra.pets}
              isLoading={extra.petsLoading}
              onSelect={handlePetSelect}
            />
          )}

          {/* Pet context banner — shown after pet is confirmed */}
          {extra.petConfirmed && extra.selectedPet?.id && (
            <div className="mx-4 mt-3 flex items-center gap-2 bg-[#1F6559]/8 border border-[#1F6559]/15 rounded-2xl px-4 py-2">
              <span className="text-base">🐾</span>
              <p className="text-[12px] font-semibold text-[#1F6559]">
                Chatting about:{" "}
                <span className="font-bold">{extra.selectedPet.name}</span>
                <span className="font-normal text-[#555]">
                  {" "}· {extra.selectedPet.pet_type}
                  {extra.selectedPet.age ? `, ${extra.selectedPet.age}` : ""}
                  {extra.selectedPet.gender ? `, ${extra.selectedPet.gender}` : ""}
                </span>
              </p>
            </div>
          )}

          {/* Message list */}
          <GopuMedicalMessageList
            messages={state.messages}
            isLoading={state.isLoading}
            messagesEndRef={messagesEndRef}
            messagesScrollRef={messagesScrollRef}
          />

          {/* Resolution bar */}
          {showResolutionBar && (
            <GopuResolutionBar onResolved={handleResolved} onNeedHelp={handleNeedHelp} />
          )}

          {/* Input footer */}
          <GopuChatInputFooter
            input={state.input}
            onInputChange={(v) => dispatch({ type: "SET_INPUT", value: v })}
            onSend={handleSend}
            uploadedImage={state.uploadedImage}
            onClearImage={() => dispatch({ type: "SET_UPLOADED_IMAGE", value: null })}
            limitReached={inputLocked}
            isLoading={state.isLoading}
            isRecording={state.isRecording}
            onPickImage={handleImageUpload}
            onToggleRecord={state.isRecording ? stopRecording : startRecording}
            fileInputRef={fileInputRef}
          />
        </div>
      </div>
    </div>
  );
};

export default GopuMedicalChat;
