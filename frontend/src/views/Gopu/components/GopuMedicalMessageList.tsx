"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, AlertTriangle, CalendarDays } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";
import { gopuChat } from "@/assets/content/gopu";
import type { GopuChatMessage } from "@/types/gopu";
import type { RefObject } from "react";

const VET_REFERRAL_SENTINEL = "__VET_REFERRAL__";

type Props = {
  messages: GopuChatMessage[];
  isLoading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  messagesScrollRef: RefObject<HTMLDivElement | null>;
};

function MarkdownBody({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, ...props }) => { void node; return <p className="mb-2 last:mb-0 leading-relaxed" {...props} />; },
          ul: ({ node, ...props }) => { void node; return <ul className="list-disc ml-5 my-2 space-y-1" {...props} />; },
          ol: ({ node, ...props }) => { void node; return <ol className="list-decimal ml-5 my-2 space-y-1" {...props} />; },
          li: ({ node, ...props }) => { void node; return <li className="leading-relaxed" {...props} />; },
          strong: ({ node, ...props }) => { void node; return <strong className="font-semibold text-[#1F6559]" {...props} />; },
          em: ({ node, ...props }) => { void node; return <em className="italic" {...props} />; },
          h1: ({ node, ...props }) => { void node; return <h1 className="text-base font-bold text-[#1F6559] mt-3 mb-1.5" {...props} />; },
          h2: ({ node, ...props }) => { void node; return <h2 className="text-sm font-bold text-[#1F6559] mt-3 mb-1.5" {...props} />; },
          h3: ({ node, ...props }) => { void node; return <h3 className="text-sm font-semibold text-[#333] mt-2 mb-1" {...props} />; },
          blockquote: ({ node, ...props }) => { void node; return <blockquote className="border-l-4 border-[#1F6559]/30 pl-3 my-2 text-[#555] italic" {...props} />; },
          code: ({ node, className, children, ...props }) => {
            void node;
            const isBlock = className?.includes("language-");
            return isBlock
              ? <code className="block bg-[#f4f4f4] rounded-lg p-3 my-2 text-xs font-mono overflow-x-auto whitespace-pre" {...props}>{children}</code>
              : <code className="bg-[#f4f4f4] rounded px-1 py-0.5 text-xs font-mono" {...props}>{children}</code>;
          },
          pre: ({ node, ...props }) => { void node; return <pre className="my-2 overflow-x-auto" {...props} />; },
          table: ({ node, ...props }) => { void node; return <div className="overflow-x-auto my-3"><table className="w-full text-xs border-collapse" {...props} /></div>; },
          thead: ({ node, ...props }) => { void node; return <thead className="bg-[#1F6559]/10" {...props} />; },
          th: ({ node, ...props }) => { void node; return <th className="border border-[#1F6559]/20 px-3 py-1.5 text-left font-semibold text-[#1F6559]" {...props} />; },
          td: ({ node, ...props }) => { void node; return <td className="border border-[#EAEAEA] px-3 py-1.5 align-top" {...props} />; },
          tr: ({ node, ...props }) => { void node; return <tr className="even:bg-[#FAFAFA]" {...props} />; },
          hr: ({ node, ...props }) => { void node; return <hr className="my-3 border-[#EAEAEA]" {...props} />; },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function VetReferralCard() {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-white border-2 border-[#1F6559]/20 rounded-2xl p-4 space-y-3 max-w-sm">
      <div className="flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-[#1F6559]" />
        <p className="text-sm font-semibold text-[#333]">Connect with a Veterinarian</p>
      </div>
      <p className="text-sm text-[#555] leading-relaxed">
        I understand you need more help. Would you like to book an appointment with one of our
        licensed veterinarians?
      </p>
      <Link href="/appointments" className="block">
        <Button className="w-full rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] flex items-center justify-center gap-2 py-5 shadow-md">
          <CalendarDays className="w-4 h-4" />
          Book an Appointment
        </Button>
      </Link>
      <p className="text-[10px] text-center text-[#9F9F9F]">
        You can also raise an emergency complaint from the sidebar.
      </p>
    </div>
  );
}

export default function GopuMedicalMessageList({
  messages,
  isLoading,
  messagesEndRef,
  messagesScrollRef,
}: Props) {
  const router = useRouter();
  const copy = gopuChat;

  return (
    <div
      ref={messagesScrollRef}
      id="gopu-medical-messages"
      className="max-h-[calc(100vh-360px)] flex-1 space-y-4 overflow-y-auto overscroll-y-contain p-4 lg:p-6"
    >
      {messages.length === 0 && !isLoading && (
        <div className="h-full flex flex-col items-center justify-center text-center py-16 text-[#9F9F9F] text-sm">
          Select your pet above to get started.
        </div>
      )}

      {messages.map((msg, idx) => (
        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
          {/* Vet referral sentinel — render as a special card */}
          {msg.role === "assistant" && msg.content === VET_REFERRAL_SENTINEL ? (
            <VetReferralCard />
          ) : (
            <div
              className={`max-w-[85%] p-4 rounded-2xl ${
                msg.role === "user"
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
                <MarkdownBody content={msg.content} />
              )}

              {msg.isWarning && (
                <div className="mt-3 pt-3 border-t border-yellow-200 flex items-center">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2 flex-shrink-0" />
                  <p className="text-xs text-yellow-700 font-medium">
                    {msg.remaining} {copy.warningRemaining}
                  </p>
                </div>
              )}

              {msg.isBlocked && (
                <div className="mt-4 pt-4 border-t border-red-200">
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
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-[#FAFAFA] border border-[#EAEAEA] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm">
            <Loader2 className="w-4 h-4 animate-spin text-[#1F6559]" />
            <span className="text-xs text-[#6F6F6F]">{copy.thinking}</span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
