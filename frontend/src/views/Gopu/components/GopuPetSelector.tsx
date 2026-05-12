"use client";

import { CheckCircle, PawPrint, ChevronRight } from "lucide-react";
import type { PetBasic } from "@/types/gopu";

const PET_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  cow: "🐄",
  buffalo: "🐃",
  goat: "🐐",
  sheep: "🐑",
  horse: "🐴",
  rabbit: "🐇",
  bird: "🦜",
  fish: "🐟",
  poultry: "🐓",
  pig: "🐷",
};

function petEmoji(type: string): string {
  return PET_EMOJI[type.toLowerCase()] ?? "🐾";
}

type Props = {
  pets: PetBasic[];
  onSelect: (pet: PetBasic) => void;
  isLoading?: boolean;
};

export default function GopuPetSelector({ pets, onSelect, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-start px-4 pt-4">
        <div className="bg-[#FAFAFA] border border-[#EAEAEA] px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-[#6F6F6F] animate-pulse">
          Fetching your registered pets…
        </div>
      </div>
    );
  }

  // ── No pets registered ──────────────────────────────────────────────────
  if (pets.length === 0) {
    return (
      <div className="flex justify-start px-4 pt-4">
        <div className="max-w-[85%] bg-[#FAFAFA] border border-[#EAEAEA] p-4 rounded-2xl rounded-tl-sm space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-400">
          <p className="text-sm text-[#333] leading-relaxed">
            It looks like you haven&apos;t registered any pets yet. No worries — just describe your
            pet and the issue below, and I&apos;ll do my best to help!
          </p>
          <button
            type="button"
            onClick={() => onSelect({ id: "", name: "your pet", pet_type: "animal" })}
            className="mt-2 flex items-center gap-2 text-[13px] font-semibold text-[#1F6559] hover:underline"
          >
            <ChevronRight className="w-4 h-4" />
            Continue without pet profile
          </button>
        </div>
      </div>
    );
  }

  // ── Single pet — confirm ─────────────────────────────────────────────────
  if (pets.length === 1) {
    const pet = pets[0];
    return (
      <div className="flex justify-start px-4 pt-4">
        <div className="max-w-[85%] bg-[#FAFAFA] border border-[#EAEAEA] p-4 rounded-2xl rounded-tl-sm space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-400">
          <p className="text-sm text-[#333] leading-relaxed">
            Are you referring to your pet{" "}
            <span className="font-bold text-[#1F6559]">{pet.name}</span>, who is a{" "}
            <span className="font-semibold">{pet.pet_type}</span>?
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSelect(pet)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1F6559] text-white text-[13px] font-semibold hover:bg-[#184F46] transition-colors active:scale-95"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Yes, that&apos;s {pet.name}
            </button>
            <button
              type="button"
              onClick={() => onSelect({ id: "", name: "my pet", pet_type: pet.pet_type })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#1F6559]/30 text-[#1F6559] text-[13px] font-semibold hover:bg-teal-50 transition-colors active:scale-95"
            >
              Different pet
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Multiple pets — pick one ─────────────────────────────────────────────
  return (
    <div className="flex justify-start px-4 pt-4">
      <div className="max-w-[92%] w-full bg-[#FAFAFA] border border-[#EAEAEA] p-4 rounded-2xl rounded-tl-sm space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-400">
        <div className="flex items-center gap-2">
          <PawPrint className="w-4 h-4 text-[#1F6559]" />
          <p className="text-sm font-semibold text-[#333]">Which pet are you referring to?</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {pets.map((pet) => (
            <button
              key={pet.id}
              type="button"
              onClick={() => onSelect(pet)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#1F6559]/20 hover:border-[#1F6559]/50 hover:bg-teal-50 text-[#333] text-[13px] font-medium transition-all duration-200 shadow-sm active:scale-95"
            >
              <span className="text-base leading-none">{petEmoji(pet.pet_type)}</span>
              <span className="font-semibold text-[#1F6559]">{pet.name}</span>
              <span className="text-[#9F9F9F]">·</span>
              <span className="text-[#6F6F6F] capitalize">{pet.pet_type}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
