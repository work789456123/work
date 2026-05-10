"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, AlertTriangle, CalendarDays } from "lucide-react";
import ReactMarkdown from "react-markdown";
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
    <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-0 prose-pre:my-0">
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => { void node; return <p className="mb-1 last:mb-0" {...props} />; },
          ul: ({ node, ...props }) => { void node; return <ul className="list-disc ml-4 my-1.5" {...props} />; },
          ol: ({ node, ...props }) => { void node; return <ol className="list-decimal ml-4 my-1.5" {...props} />; },
          li: ({ node, ...props }) => { void node; return <li className="my-0.5" {...props} />; },
          strong: ({ node, ...props }) => { void node; return <strong className="font-bold text-[#1F6559]" {...props} />; },
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
