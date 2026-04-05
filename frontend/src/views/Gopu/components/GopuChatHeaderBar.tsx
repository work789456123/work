import { CreditCard, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gopuChat } from "@/assets/content/gopu";
import type { GopuChatHeaderBarProps } from "@/types/gopu";

export default function GopuChatHeaderBar({
  credits,
  remainingMessages,
  mobileSidebarOpen,
  onToggleMobileSidebar,
}: GopuChatHeaderBarProps) {
  const hc = gopuChat.header;
  return (
    <div
      id="gopu-chat-header"
      className="p-4 lg:p-6 border-b border-[#EAEAEA] flex items-center justify-between bg-teal-50 sticky top-0 z-10"
    >
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0 text-[#1F6559] hover:bg-[#1F6559]/10"
          onClick={onToggleMobileSidebar}
          aria-expanded={mobileSidebarOpen}
          aria-controls="gopu-chat-sidebar"
          aria-label={hc.toggleChatsAria}
        >
          <PanelLeft className="w-5 h-5" />
        </Button>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#1F6559]/20">
          <video
            src="/gopuhivideo2.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-bold text-[#333]">{hc.title}</h2>
          <p className="text-xs text-[#6F6F6F]">{hc.subtitle}</p>
        </div>
      </div>
      {credits && (
        <div
          className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-medium ${credits.has_subscription
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-gray-50 border-gray-200 text-[#333]"
            }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>
            {credits.has_subscription ? hc.unlimited : `${remainingMessages} ${hc.leftSuffix}`}
          </span>
        </div>
      )}
    </div>
  );
}
