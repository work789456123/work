"use client";

import Link from "next/link";
import { ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { navbarActions } from "@/assets/content/shared/auth_ui";
import type { NavbarMobileMenuProps } from "@/types/navbar";
import NavbarUserProfile from "./NavbarUserProfile";

export default function NavbarMobileMenu({
  open,
  rakshaOpen,
  isLoggedIn,
  onClose,
  onToggleRaksha,
  onGopuClick,
  onLogout,
  onOpenAuth,
}: NavbarMobileMenuProps) {
  if (!open) return null;

  return (
    <div id="user-navbar-mobile" className="xl:hidden pb-4 space-y-2" data-testid="mobile-menu">
      <Link
        href="/"
        onClick={() => onClose()}
        className="block px-4 py-3 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10"
      >
        Home
      </Link>
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => onToggleRaksha()}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10"
        >
          Pashu Raksha{" "}
          <ChevronDown
            className={`ml-1 h-4 w-4 transition-transform ${rakshaOpen ? "rotate-180" : ""}`}
          />
        </button>
        {rakshaOpen && (
          <div className="space-y-1 border-l-2 border-white/20 ml-4 py-1">
            <Link
              href="/pashucare-suraksha-plan"
              onClick={() => onClose()}
              className="block w-full text-left px-4 py-2 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10 ml-2"
            >
              Gopu.AI
            </Link>
            <button
              type="button"
              onClick={() => {
                toast.info("Care Collection is Coming Soon!", {
                  closeButton: true,
                });
                onClose();
              }}
              className="block w-full text-left px-4 py-2 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10 opacity-70 ml-2"
            >
              Care Collection
            </button>
          </div>
        )}
      </div>
      <Link
        href="/appointments"
        onClick={() => onClose()}
        className="block px-4 py-3 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10"
      >
        Consult with Doctor
      </Link>
      <Link
        href="/blogs"
        onClick={() => onClose()}
        className="block px-4 py-3 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10"
      >
        Blog
      </Link>
      <Link
        href="/about"
        onClick={() => onClose()}
        className="block px-4 py-3 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10"
      >
        About Us
      </Link>
      <Link
        href="/our-story"
        onClick={() => onClose()}
        className="block px-4 py-3 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10"
      >
        Founders Stories
      </Link>
      <Link
        href="/contact"
        onClick={() => onClose()}
        className="block px-4 py-3 text-sm font-medium rounded-lg text-white/90 hover:text-white hover:bg-white/10"
      >
        Contact Us
      </Link>
      <Link
        href="/pashucare-suraksha-plan"
        onClick={() => onClose()}
        className="block px-4 py-3 text-sm font-medium rounded-lg bg-yellow-500 text-black hover:bg-yellow-400"
      >
        PashuCare Suraksha Plan
      </Link>

      <Button
        onClick={() => {
          onGopuClick();
          onClose();
        }}
        className="w-full rounded-full bg-white text-[#1F6559] hover:bg-white/90 font-semibold"
      >
        {navbarActions.tryGopu}
      </Button>

      {isLoggedIn && (
        <>
          <NavbarUserProfile 
            onLogout={() => {
              onLogout();
              onClose();
            }} 
            trigger={
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 rounded-full border-white/30 text-white hover:bg-white/10 mt-2"
              >
                <User className="h-4 w-4" /> My Profile
              </Button>
            }
          />
          <Button
            onClick={() => {
              onLogout();
              onClose();
            }}
            variant="outline"
            className="w-full rounded-full border-white/30 text-white hover:bg-white/10 mt-2 hover:bg-red-500/20 hover:text-red-100 hover:border-red-500/30"
          >
            {navbarActions.logout}
          </Button>
        </>
      )}

      {!isLoggedIn && (
        <Button
          onClick={() => {
            onOpenAuth();
            onClose();
          }}
          variant="outline"
          className="w-full rounded-full border-white/30 text-white hover:bg-white/10 mt-2"
        >
          {navbarActions.loginSignup}
        </Button>
      )}
    </div>
  );
}
