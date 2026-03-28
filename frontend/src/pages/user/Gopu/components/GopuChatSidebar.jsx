import { Button } from "@/components/ui/button";
import { Plus, Clock, MessageSquare } from "lucide-react";
import { gopuChat } from "@/assets/content/gopu";

export default function GopuChatSidebar({
  sessions,
  sessionId,
  onNewChat,
  onSelectSession,
}) {
  const c = gopuChat.sidebar;
  return (
    <div
      id="gopu-chat-sidebar"
      className="hidden lg:flex w-80 bg-teal-50 border-r border-[#EAEAEA] flex-col p-6 space-y-6"
    >
      <Button
        onClick={onNewChat}
        className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] flex items-center justify-center gap-2 py-6"
      >
        <Plus className="w-5 h-5" />
        {c.newChat}
      </Button>
      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="flex items-center gap-2 text-[#6F6F6F] px-2">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">{c.recentHistory}</span>
        </div>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-[#9F9F9F] text-sm">{c.emptyHistory}</div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${sessionId === session.id
                    ? "bg-[#1F6559]/5 border border-[#1F6559]/20 text-[#1F6559]"
                    : "hover:bg-gray-50 text-[#6F6F6F]"
                  }`}
              >
                <MessageSquare
                  className={`w-4 h-4 mt-1 ${sessionId === session.id ? "text-[#1F6559]" : "text-[#9F9F9F]"}`}
                />
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium truncate">{c.sessionLabel}</p>
                  <p className="text-[10px] opacity-60">
                    {new Date(session.created_at).toLocaleDateString()} at{" "}
                    {new Date(session.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
