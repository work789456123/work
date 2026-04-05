"use client";

import { useCallback, useEffect, useState } from "react";
import { useGopuChatController } from "@/hooks/useGopuChatController";
import { gopuChat } from "@/assets/content/gopu";
import GopuChatSidebar from "./components/GopuChatSidebar";
import GopuChatHeaderBar from "./components/GopuChatHeaderBar";
import GopuChatMessageList from "./components/GopuChatMessageList";
import GopuChatInputFooter from "./components/GopuChatInputFooter";
import PawTexture from "@/components/PawTexture";

const GopuChat = () => {
	const {
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
	} = useGopuChatController();

	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
	const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);
	const toggleMobileSidebar = useCallback(() => setMobileSidebarOpen((o) => !o), []);

	const handleNewChat = useCallback(() => {
		startNewSession();
		closeMobileSidebar();
	}, [startNewSession, closeMobileSidebar]);

	const handleSelectSession = useCallback(
		(id: string) => {
			loadSessionHistory(id);
			closeMobileSidebar();
		},
		[loadSessionHistory, closeMobileSidebar],
	);

	useEffect(() => {
		if (!mobileSidebarOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeMobileSidebar();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [mobileSidebarOpen, closeMobileSidebar]);

	return (
		<div
			id="page-gopu-chat"
			className="flex flex-col lg:flex-row lg:justify-end min-h-screen bg-[#FAFAFA] relative"
			data-testid="gopu-chat-page"
		>
			{mobileSidebarOpen ? (
				<button
					type="button"
					aria-label={gopuChat.header.closeSidebarAria}
					className="lg:hidden fixed left-0 right-0 bottom-0 top-20 z-30 bg-black/40"
					onClick={closeMobileSidebar}
				/>
			) : null}
			<GopuChatSidebar
				sessions={state.sessions}
				sessionId={state.sessionId}
				onNewChat={handleNewChat}
				onSelectSession={handleSelectSession}
				isMobileOpen={mobileSidebarOpen}
				onRequestCloseMobile={closeMobileSidebar}
			/>
			<div
				id="gopu-chat-main"
				className=" flex flex-col items-center py-8 px-4 lg:py-6 lg:px-6 lg:w-[calc(100%-20rem)] overflow-hidden relative"
			>
				<PawTexture />
				<div
					id="gopu-chat-panel"
					className="w-full max-w-3xl flex flex-col relative  bg-teal-50 rounded-3xl shadow-sm border border-[#EAEAEA] overflow-hidden"
				>
					<GopuChatHeaderBar
						credits={state.credits}
						remainingMessages={state.remainingMessages}
						mobileSidebarOpen={mobileSidebarOpen}
						onToggleMobileSidebar={toggleMobileSidebar}
					/>
					<GopuChatMessageList
						messages={state.messages}
						isLoading={state.isLoading}
						messagesEndRef={messagesEndRef}
						messagesScrollRef={messagesScrollRef}
					/>
					<GopuChatInputFooter
						input={state.input}
						onInputChange={(v) => dispatch({ type: "SET_INPUT", value: v })}
						onSend={handleSend}
						uploadedImage={state.uploadedImage}
						onClearImage={() =>
							dispatch({ type: "SET_UPLOADED_IMAGE", value: null })
						}
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
