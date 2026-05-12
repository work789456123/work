"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Sparkles, Heart, MessageCircle, AlertCircle } from "lucide-react";

const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("openPromoModal", handleOpen);
    return () => window.removeEventListener("openPromoModal", handleOpen);
  }, []);

  const go = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md text-center p-6 border-0 rounded-[28px] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#1FA7A6] via-[#38C2B4] to-[#78D65C] opacity-20 -z-10 blur-xl" />

        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-[#1FA7A6]/10 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-[#1FA7A6]" fill="currentColor" />
          </div>
          <DialogTitle className="heading-font text-2xl font-bold text-[#333] mb-2">
            {"Protect Your Pet's Future"}
          </DialogTitle>
          <DialogDescription className="text-base text-[#6F6F6F] leading-relaxed">
            Discover our{" "}
            <span className="font-semibold text-[#1F6559]">PashuCare Suraksha Plan</span> for
            comprehensive protection and intelligent care.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-5">
          <div className="bg-[#1F6559]/5 rounded-2xl p-4 border border-[#1F6559]/10 text-left">
            <ul className="space-y-3">
              {[
                "Unlimited Gopu.AI Health Consultations",
                "Priority Emergency Support",
                "Comprehensive Health Records",
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-3 text-sm text-[#333]">
                  <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            onClick={() => go("/pashucare-suraksha-plan")}
            className="w-full rounded-full bg-amber-500 text-black hover:bg-amber-400 font-semibold py-6 text-lg transition-transform hover:scale-[1.02]"
          >
            View Suraksha Plan
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#EAEAEA]" />
            <span className="text-xs text-[#9F9F9F] font-medium">or chat with Gopu</span>
            <div className="flex-1 h-px bg-[#EAEAEA]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => go("/gopu")}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-[#1FA7A6]/20 hover:border-[#1FA7A6]/60 hover:bg-[#1FA7A6]/5 transition-all duration-200 active:scale-[0.97]"
            >
              <div className="w-10 h-10 rounded-full bg-[#1FA7A6]/10 flex items-center justify-center group-hover:bg-[#1FA7A6]/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-[#1FA7A6]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#333]">General Chat</p>
                <p className="text-[10px] text-[#9F9F9F] leading-tight mt-0.5">
                  Ask Gopu anything
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => go("/gopu/medical")}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-red-200 hover:border-red-400 hover:bg-red-50/60 transition-all duration-200 active:scale-[0.97]"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#333]">Medical Issue</p>
                <p className="text-[10px] text-[#9F9F9F] leading-tight mt-0.5">
                  Report a complaint
                </p>
              </div>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromoModal;
