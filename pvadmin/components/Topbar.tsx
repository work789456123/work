"use client";

import { Search, Bell, HelpCircle, Menu, LogOut, ChevronDown, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin User");
  const [adminRole, setAdminRole] = useState("admin");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAdminName(localStorage.getItem("admin_name") || "Admin User");
    setAdminRole(localStorage.getItem("admin_role") || "admin");

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    localStorage.removeItem("admin_role");
    router.replace("/auth");
  };

  const userInitial = adminName.charAt(0).toUpperCase();

  return (
    <header className="bg-[#1F6559] text-white py-3 px-4 md:px-8 border-b border-[#154d43] flex items-center justify-between z-10 shrink-0">
      <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-lg">
        <button 
          className="md:hidden text-white hover:text-gray-200 p-1 -ml-1 rounded-md active:bg-white/10" 
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Search data, animals..." 
            className="w-full pl-10 pr-4 py-2 bg-[#154d43] border border-white/20 rounded-lg text-sm text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5 ml-4">
        <button className="text-gray-300 hover:text-white hidden sm:block"><Bell size={20} /></button>
        <button className="text-gray-300 hover:text-white hidden sm:block"><HelpCircle size={20} /></button>
        <div className="h-8 w-[1px] bg-white/20 mx-1 md:mx-2 hidden sm:block"></div>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            className="flex items-center gap-3 hover:bg-white/10 p-1 pr-2 rounded-xl transition-colors"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white tracking-tight">{adminName}</p>
              <p className="text-[10px] text-[#86dfc9] font-semibold uppercase tracking-wider">
                {adminRole === "superadmin" ? "Super Admin" : "Admin"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-white border-2 border-[#154d43] shadow-sm overflow-hidden flex items-center justify-center font-bold text-[#1F6559] shrink-0">
                {userInitial}
              </div>
              <ChevronDown size={16} className={`text-gray-300 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 border-b border-slate-100 mb-1">
                <p className="text-sm font-bold text-slate-900 truncate">{adminName}</p>
                <p className="text-[11px] font-semibold text-[#1F6559] uppercase tracking-wider mt-0.5">
                  {adminRole === "superadmin" ? "Super Admin" : "Admin"}
                </p>
              </div>
              
              <button 
                onClick={() => {
                  setDropdownOpen(false);
                  router.push("/admin-users");
                }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-600"
              >
                <Settings size={16} />
                Admin Settings
              </button>
              
              <div className="h-[1px] bg-slate-100 my-1"></div>
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 transition-colors flex items-center gap-3 font-medium"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
