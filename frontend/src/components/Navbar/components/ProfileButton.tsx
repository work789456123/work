"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Settings, 
  LogOut, 
  Package, 
  ChevronRight, 
  Calendar, 
  MessageSquare,
  ShieldCheck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { navbarActions } from "@/assets/content/shared/auth_ui";

interface ProfileButtonProps {
  onLogout: () => void;
}

export default function ProfileButton({ onLogout }: ProfileButtonProps) {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const name = localStorage.getItem("user_name") || "User";
      const email = localStorage.getItem("user_email") || "";
      setUser({ name, email });
    };

    loadUser();

    // Listen for auth success to refresh user info
    window.addEventListener("authSuccess", loadUser);
    return () => window.removeEventListener("authSuccess", loadUser);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex items-center justify-center rounded-full border-2 border-white/20 p-0.5 transition-all hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-95">
          <Avatar className="h-9 w-9 border border-[#1F6559]/10 shadow-sm">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-[#1FA7A6] to-[#78D65C] font-bold text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 mt-2 p-2 rounded-2xl border-[#E2E8E5] shadow-xl animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
        align="end"
      >
        <DropdownMenuLabel className="p-4">
          <div className="flex flex-col space-y-1">
            <p className="text-base font-bold text-[#1F1F1F] leading-none">{user.name}</p>
            <p className="text-xs font-medium text-[#6F6F6F] truncate opacity-80">{user.email || "No email provided"}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-[#E2E8E5]/60" />
        
        <DropdownMenuItem 
          onClick={() => router.push("/orders")}
          className="p-2.5 rounded-xl cursor-pointer hover:bg-[#1F6559]/5 focus:bg-[#1F6559]/5 hover:text-[#1F1F1F] focus:text-[#1F1F1F] text-[#1F1F1F] transition-colors"
        >
          <div className="flex items-center w-full">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F6559]/10 text-[#1F6559] mr-3">
              <Package className="h-4 w-4" />
            </div>
            <span className="font-semibold text-sm">{navbarActions.profile.yourOrders}</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="p-2.5 rounded-xl cursor-pointer hover:bg-[#1F6559]/5 focus:bg-[#1F6559]/5 hover:text-[#1F1F1F] focus:text-[#1F1F1F] text-[#1F1F1F] transition-colors data-[state=open]:bg-[#1F6559]/5 data-[state=open]:text-[#1F1F1F]">
            <div className="flex items-center w-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F6559]/10 text-[#1F6559] mr-3">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="font-semibold text-sm">{navbarActions.profile.tracking}</span>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-56 p-2 rounded-xl border-[#E2E8E5] shadow-lg ml-1">
              <DropdownMenuItem 
                onClick={() => router.push("/tracking/appointments")}
                className="p-2.5 rounded-lg cursor-pointer hover:bg-[#1F6559]/5 focus:bg-[#1F6559]/5 hover:text-[#1F1F1F] focus:text-[#1F1F1F] text-[#1F1F1F]"
              >
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2.5 text-[#1F6559]" />
                  <span className="text-sm font-medium">{navbarActions.profile.appointmentTracking}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => router.push("/tracking/pet-cabs")}
                className="p-2.5 rounded-lg cursor-pointer hover:bg-[#1F6559]/5 focus:bg-[#1F6559]/5 hover:text-[#1F1F1F] focus:text-[#1F1F1F] text-[#1F1F1F]"
              >
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-2.5 text-[#1F6559]" />
                  <span className="text-sm font-medium">Pet Cab Tracking</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => router.push("/tracking/medical-queries")}
                className="p-2.5 rounded-lg cursor-pointer hover:bg-[#1F6559]/5 focus:bg-[#1F6559]/5 hover:text-[#1F1F1F] focus:text-[#1F1F1F] text-[#1F1F1F]"
              >
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2.5 text-[#1F6559]" />
                  <span className="text-sm font-medium">{navbarActions.profile.medicalQueryTracking}</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator className="bg-[#E2E8E5]/60" />
        
        <DropdownMenuItem 
          onClick={onLogout}
          className="p-2.5 rounded-xl cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600 transition-colors"
        >
          <div className="flex items-center w-full">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 mr-3">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm">{navbarActions.logout}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
