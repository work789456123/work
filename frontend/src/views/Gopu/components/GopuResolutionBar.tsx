"use client";

import { CheckCircle, HelpCircle } from "lucide-react";

type Props = {
  onResolved: () => void;
  onNeedHelp: () => void;
};

export default function GopuResolutionBar({ onResolved, onNeedHelp }: Props) {
  return (
    <div className="px-4 lg:px-6 pb-3 animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="flex items-center gap-3 bg-teal-50/80 border border-[#1F6559]/15 rounded-2xl px-4 py-3">
        <p className="text-[12px] font-medium text-[#555] flex-1">Did this help?</p>
        <button
          type="button"
          onClick={onResolved}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1F6559] text-white text-[12px] font-semibold hover:bg-[#184F46] transition-colors active:scale-95"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Yes, resolved
        </button>
        <button
          type="button"
          onClick={onNeedHelp}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#1F6559]/30 text-[#1F6559] text-[12px] font-semibold hover:bg-teal-100 transition-colors active:scale-95"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Need more help
        </button>
      </div>
    </div>
  );
}
