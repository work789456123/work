import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Clock, MessageSquare, X } from "lucide-react";
import { gopuChat } from "@/assets/content/gopu";
import type { GopuChatSidebarProps } from "@/types/gopu";

export default function GopuChatSidebar({
  sessions,
  sessionId,
  onNewChat,
  onSelectSession,
  isMobileOpen,
  onRequestCloseMobile,
}: GopuChatSidebarProps) {
  const c = gopuChat.sidebar;
  const hc = gopuChat.header;
  return (
    <div
      id="gopu-chat-sidebar"
      role="navigation"
      aria-label={c.recentHistory}
      className={cn(
        "flex fixed top-0 left-0 h-full w-80 max-w-[85vw] mt-20 bg-teal-50 border-r border-[#EAEAEA] flex-col p-6 space-y-6 z-40",
        "transition-transform duration-200 ease-out",
        "lg:translate-x-0 lg:pointer-events-auto",
        isMobileOpen
          ? "max-lg:translate-x-0 max-lg:pointer-events-auto"
          : "max-lg:-translate-x-full max-lg:pointer-events-none",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="lg:hidden absolute top-4 right-4 z-10 text-[#6F6F6F] hover:text-[#333]"
        onClick={onRequestCloseMobile}
        aria-label={hc.closeSidebarAria}
      >
        <X className="w-5 h-5" />
      </Button>
      <Button
        onClick={onNewChat}
        className={cn(
          "w-full rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] flex items-center justify-center gap-2 py-6",
          "max-lg:pr-12",
        )}
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
                    {new Date(session.created_at ?? session.updatedAt ?? 0).toLocaleDateString()} at{" "}
                    {new Date(session.created_at ?? session.updatedAt ?? 0).toLocaleTimeString([], {
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
