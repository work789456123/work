"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  User,
  PawPrint,
  Monitor,
  Stethoscope,
  CalendarCheck,
  Bell,
  CreditCard,
  BarChart3,
  Settings,
  X,
  Package,
  ShieldCheck,
  Key,
  AlertTriangle,
  Car
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

import { useEffect, useState } from "react";

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [hasEmergency, setHasEmergency] = useState(false);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
        const token = localStorage.getItem("admin_token");
        if (!token) return;
        const res = await fetch(`${API_URL}/api/medical-emergency`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const pending = data.some((e: any) => e.status === "pending");
          setHasEmergency(pending);
        }
      } catch (err) {}
    };
    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 5000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { name: "User", icon: <User size={20} />, href: "/users" },
    { name: "Animal Record", icon: <PawPrint size={20} />, href: "/animals" },
    { name: "AI Monitoring", icon: <Monitor size={20} />, href: "/ai-monitoring" },
    { name: "Vets", icon: <Stethoscope size={20} />, href: "/vets" },
    { name: "Medical Emergency", icon: <AlertTriangle size={20} />, href: "/vets/medical-emergencies" },
    { name: "Appointment", icon: <CalendarCheck size={20} />, href: "/appointments" },
    { name: "Cabs Scheduled", icon: <Car size={20} />, href: "/cabs-scheduled" },

    // ✅ NEW PRODUCTS SECTION
    { name: "Products", icon: <Package size={20} />, href: "/products" },
  ];

  const systemItems = [
    { name: "Notification", icon: <Bell size={20} />, href: "/notifications" },
    { name: "Payments", icon: <CreditCard size={20} />, href: "/payments" },
    { name: "Report", icon: <BarChart3 size={20} />, href: "/reports" },
    { name: "Settings", icon: <Settings size={20} />, href: "/settings" },
    { name: "Admin Access", icon: <ShieldCheck size={20} />, href: "/admin-users" },
    { name: "Reset Tickets", icon: <Key size={20} />, href: "/tickets" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen?.(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-[#1F6559] text-white py-2 pt-12 border-r border-[#154d43] flex flex-col z-50 w-64 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="px-6 pb-6 flex flex-col gap-4 relative">
          <div className="flex items-start justify-between">
            {/* Cropped Logo Icon */}
            <div 
              className="h-12 w-12 rounded-xl bg-white shadow-md flex-shrink-0 border-2 border-white/20"
              style={{
                backgroundImage: 'url(/pvhalflogo.png)',
                backgroundSize: 'auto 110%',
                backgroundPosition: '-2px center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            
            <button
              className="md:hidden text-gray-300 hover:text-white p-1 rounded-md active:bg-white/10"
              onClick={() => setIsOpen?.(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Pashuvaani</h1>
            <p className="text-[10px] text-[#86dfc9] tracking-widest uppercase font-bold mt-0.5">
              Admin Console
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-medium text-sm relative ${
                item.name === "Medical Emergency" && hasEmergency
                  ? "bg-red-500/20 text-white animate-pulse border border-red-500/30"
                  : "text-gray-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.icon}
              {item.name}
              {item.name === "Medical Emergency" && hasEmergency && (
                <>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75" />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)]" />
                </>
              )}
            </Link>
          ))}

          {/* System Section */}
          <div className="mt-8 mb-2 px-3">
            <p className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
              System
            </p>
          </div>

          {systemItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-gray-200 hover:bg-white/10 hover:text-white rounded-lg transition-colors font-medium text-sm"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}