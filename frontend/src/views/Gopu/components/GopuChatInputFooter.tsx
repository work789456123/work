"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Mic, Send, X, MicOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { gopuChat } from "@/assets/content/gopu";
import type { GopuChatInputFooterProps } from "@/types/gopu";

export default function GopuChatInputFooter({
  input,
  onInputChange,
  onSend,
  uploadedImage,
  onClearImage,
  limitReached,
  isLoading,
  isRecording,
  onPickImage,
  onToggleRecord,
  fileInputRef,
}: GopuChatInputFooterProps) {
  const router = useRouter();
  const c = gopuChat;

  return (
    <div id="gopu-chat-input-footer" className="p-4 lg:p-6 border-t border-[#EAEAEA] bg-teal-50">
      {uploadedImage && (
        <div className="mb-3 relative inline-block">
          <Image
            src={uploadedImage.preview}
            alt=""
            width={80}
            height={80}
            unoptimized
            className="h-20 w-20 rounded-lg border object-cover"
          />
          <button
            type="button"
            onClick={onClearImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {limitReached && (
        <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center animate-in fade-in slide-in-from-bottom-2">
          <p className="text-red-700 font-bold mb-1">{c.limitBanner.title}</p>
          <p className="text-red-600 text-xs mb-3">{c.limitBanner.description}</p>
          <Button
            onClick={() => router.push("/pashucare-suraksha-plan")}
            className="w-full rounded-full bg-red-600 text-white hover:bg-red-700 shadow-sm"
          >
            {c.limitBanner.cta}
          </Button>
        </div>
      )}

      <div className={`relative ${limitReached ? "opacity-50 pointer-events-none" : ""}`}>
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={limitReached}
          placeholder={limitReached ? c.input.placeholderLimited : c.input.placeholder}
          className="min-h-[60px] max-h-[150px] pr-28 rounded-2xl border-[#EAEAEA] focus:border-[#1F6559] resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !limitReached) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <div className="absolute right-2 bottom-2 flex items-center gap-1">
          <input
            id="gopu-chat-file-input"
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={onPickImage}
            accept="image/*"
          />
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={limitReached}
            className="text-[#6F6F6F] hover:text-[#1F6559]"
          >
            <Upload className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={onToggleRecord}
            disabled={limitReached}
            className={isRecording ? "text-red-500 bg-red-100 hover:bg-red-200 border border-red-300 animate-pulse" : "text-[#6F6F6F] hover:text-red-500 hover:bg-red-50"}
          >
            {isRecording ? <div className="w-3.5 h-3.5 rounded-sm bg-red-600" /> : <Mic className="w-5 h-5" />}
          </Button>
          <Button
            type="button"
            onClick={onSend}
            disabled={isLoading || (!input.trim() && !uploadedImage) || limitReached}
            className="bg-[#1F6559] hover:bg-[#184F46] text-white rounded-xl px-4 h-9"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <p className="text-[10px] text-center text-[#9F9F9F] mt-3">{c.footerNote}</p>
    </div>
  );
}
