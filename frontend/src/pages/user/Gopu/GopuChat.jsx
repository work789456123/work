import { useGopuChatController } from "@/hooks/useGopuChatController";
import GopuChatSidebar from "./components/GopuChatSidebar";
import GopuChatHeaderBar from "./components/GopuChatHeaderBar";
import GopuChatMessageList from "./components/GopuChatMessageList";
import GopuChatInputFooter from "./components/GopuChatInputFooter";

const GopuChat = () => {
  const {
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
  } = useGopuChatController();

  return (
    <div
      id="page-gopu-chat"
      className="flex flex-col lg:flex-row min-h-screen bg-[#FAFAFA]"
      data-testid="gopu-chat-page"
    >
      <GopuChatSidebar
        sessions={state.sessions}
        sessionId={state.sessionId}
        onNewChat={startNewSession}
        onSelectSession={loadSessionHistory}
      />
      <div
        id="gopu-chat-main"
        className="flex-1 flex flex-col items-center py-8 px-4 lg:py-12 lg:px-6 overflow-hidden"
      >
        <div
          id="gopu-chat-panel"
          className="w-full max-w-3xl flex flex-col h-full bg-teal-50 rounded-3xl shadow-sm border border-[#EAEAEA] overflow-hidden"
        >
          <GopuChatHeaderBar credits={state.credits} remainingMessages={state.remainingMessages} />
          <GopuChatMessageList
            messages={state.messages}
            isLoading={state.isLoading}
            messagesEndRef={messagesEndRef}
          />
          <GopuChatInputFooter
            input={state.input}
            onInputChange={(v) => dispatch({ type: "SET_INPUT", value: v })}
            onSend={handleSend}
            uploadedImage={state.uploadedImage}
            onClearImage={() => dispatch({ type: "SET_UPLOADED_IMAGE", value: null })}
            limitReached={state.limitReached}
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

export default GopuChat;
