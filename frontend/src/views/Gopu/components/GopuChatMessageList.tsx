"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2, Plus, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { gopuChat } from "@/assets/content/gopu";
import { FAQ_LIST } from "@/data/chatbot";
import type { GopuChatMessageListProps } from "@/types/gopu";

export default function GopuChatMessageList({
  messages,
  isLoading,
  messagesEndRef,
  messagesScrollRef,
  onFAQClick,
}: GopuChatMessageListProps) {
  const router = useRouter();
  const copy = gopuChat;

  return (
    <div
      ref={messagesScrollRef}
      id="gopu-chat-messages"
      className="max-h-[calc(100vh-360px)] flex-1 space-y-6 overflow-y-auto overscroll-y-contain p-4 lg:p-6"
    >
      {messages.length === 0 && !isLoading && (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
          <div className="w-20 h-20 bg-[#1F6559]/5 rounded-3xl flex items-center justify-center transform rotate-12">
            <MessageSquare className="w-10 h-10 text-[#1F6559]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#333]">{copy.emptyState.title}</h3>
            <p className="text-sm text-[#6F6F6F] max-w-xs mx-auto">{copy.emptyState.subtitle}</p>
          </div>
        </div>
      )}

      {messages.map((msg, idx: number) => (
        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-[85%] p-4 rounded-2xl ${msg.role === "user"
                ? "bg-[#1F6559] text-white rounded-tr-sm"
                : msg.isBlocked
                  ? "bg-red-50 border-2 border-red-200 text-[#333] rounded-tl-sm shadow-sm"
                  : msg.isWarning
                    ? "bg-yellow-50 border-2 border-yellow-200 text-[#333] rounded-tl-sm shadow-sm"
                    : "bg-[#FAFAFA] border border-[#EAEAEA] text-[#333] rounded-tl-sm"
              }`}
          >
            {msg.image && (
              <Image
                src={msg.image}
                alt="Upload"
                width={400}
                height={300}
                unoptimized
                className="mb-2 max-h-48 w-auto max-w-full rounded-lg object-contain"
              />
            )}
            {msg.role === "user" ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            ) : (
              <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:leading-relaxed prose-p:my-0 prose-pre:my-0">
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => {
                      void node;
                      return <p className="mb-0 last:mb-0" {...props} />;
                    },
                    ul: ({ node, ...props }) => {
                      void node;
                      return <ul className="list-disc ml-4 my-2" {...props} />;
                    },
                    ol: ({ node, ...props }) => {
                      void node;
                      return <ol className="list-decimal ml-4 my-2" {...props} />;
                    },
                    li: ({ node, ...props }) => {
                      void node;
                      return <li className="my-1" {...props} />;
                    },
                    strong: ({ node, ...props }) => {
                      void node;
                      return <strong className="font-bold text-[#333]" {...props} />;
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            )}

            {msg.isWarning && (
              <div className="mt-3 pt-3 border-t border-yellow-200 flex items-center">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                <p className="text-xs text-yellow-700 font-medium">
                  {msg.remaining} {copy.warningRemaining}
                </p>
              </div>
            )}

            {msg.isBlocked && (
              <div className="mt-4 pt-4 border-t border-red-200 space-y-3">
                <Button
                  onClick={() => router.push("/pashucare-suraksha-plan")}
                  className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] py-5 shadow-md flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {copy.explorePlanCta}
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}

      {!isLoading && messages.length > 0 && messages[messages.length - 1].role === "assistant" && !messages.some(m => m.role === "user" && !FAQ_LIST.some(f => f.question === m.content)) && (
        <div className="flex flex-col items-start gap-4 ml-2 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 ml-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1F6559]" />
            <p className="text-xs font-bold text-[#1F6559]/70 uppercase tracking-widest">Suggested Questions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
            {FAQ_LIST.map((faq, index) => (
              <button
                key={index}
                onClick={() => onFAQClick?.(faq)}
                className="text-left px-5 py-4 rounded-2xl bg-white border border-[#1F6559]/10 text-[#1F6559] text-[13px] font-semibold hover:bg-teal-50 hover:border-[#1F6559]/30 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-between group active:scale-[0.98]"
              >
                <span className="leading-tight pr-4">{faq.question}</span>
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1F6559]/5 flex items-center justify-center group-hover:bg-[#1F6559] group-hover:text-white transition-colors duration-300">
                  <Plus className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-[#FAFAFA] border border-[#EAEAEA] p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#1F6559]" />
            <span className="text-xs text-[#6F6F6F]">{copy.thinking}</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
