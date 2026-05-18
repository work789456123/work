"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, AlertTriangle, Stethoscope } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";
import { gopuChat } from "@/assets/content/gopu";
import { FAQ_LIST, faqAnswerForLanguage, faqChipLabel, normalizeGopuLanguage } from "@/data/chatbot";
import type { GopuChatMessageListProps } from "@/types/gopu";

export default function GopuChatMessageList({
  messages,
  isLoading,
  messagesEndRef,
  messagesScrollRef,
  language = "Hindi",
  onFAQClick,
}: GopuChatMessageListProps) {
  const router = useRouter();
  const copy = gopuChat;
  const lang = normalizeGopuLanguage(language);
  const quickSectionTitle =
    lang === "Hindi" ? copy.faqChips.quickQuestionsHi : copy.faqChips.quickQuestions;

  /** FAQs are only offered while the user hasn't sent any real message yet */
  const hasUserMessages = messages.some((m) => m.role === "user");

  return (
    <div
      ref={messagesScrollRef}
      id="gopu-chat-messages"
      className="max-h-[calc(100vh-360px)] flex-1 space-y-4 overflow-y-auto overscroll-y-contain p-4 lg:p-6"
    >
      {/* ── Empty state ─────────────────────────────────────────────── */}
      {messages.length === 0 && !isLoading && (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
          <div className="w-20 h-20 bg-[#1F6559]/5 rounded-3xl flex items-center justify-center transform rotate-12">
            <Stethoscope className="w-10 h-10 text-[#1F6559]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#333]">{copy.emptyState.title}</h3>
            <p className="text-sm text-[#6F6F6F] max-w-xs mx-auto">{copy.emptyState.subtitle}</p>
          </div>
        </div>
      )}

      {/* ── Message list ─────────────────────────────────────────────── */}
      {messages.map((msg, idx) => (
        <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
          {/* Bubble */}
          <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} w-full`}>
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
                    {msg.content}
                  </ReactMarkdown>
                </div>
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

          {/* ── FAQ chips (only below the welcome message, before any user input) ── */}
          {msg.isWelcome && !hasUserMessages && !isLoading && (
            <div className="mt-4 max-w-[92%] w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
              <p className="text-[11px] font-semibold text-[#1F6559]/60 uppercase tracking-widest mb-2.5 ml-0.5">
                {quickSectionTitle}
              </p>
              <div className="flex flex-col gap-2">
                {FAQ_LIST.map((faq, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      onFAQClick?.({
                        question: faqChipLabel(faq, lang),
                        answer: faqAnswerForLanguage(faq, lang),
                      })
                    }
                    className="group flex items-center gap-3 text-left px-4 py-3 rounded-2xl bg-white border border-[#1F6559]/15 hover:border-[#1F6559]/40 hover:bg-teal-50/60 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
                  >
                    <span className="text-lg leading-none flex-shrink-0" aria-hidden>
                      {faq.emoji}
                    </span>
                    <span className="text-[13px] font-medium text-[#333] group-hover:text-[#1F6559] transition-colors duration-200 leading-snug">
                      {faqChipLabel(faq, lang)}
                    </span>
                    <span className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-[#1F6559]/8 flex items-center justify-center group-hover:bg-[#1F6559] transition-colors duration-200">
                      <svg
                        className="w-2.5 h-2.5 text-[#1F6559] group-hover:text-white transition-colors duration-200"
                        viewBox="0 0 10 10"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M3 5h4M5 3l2 2-2 2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* ── Typing indicator ─────────────────────────────────────────── */}
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
