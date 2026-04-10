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
  Package, // ✅ Added
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { name: "User", icon: <User size={20} />, href: "/users" },
    { name: "Animal Record", icon: <PawPrint size={20} />, href: "/animals" },
    { name: "AI Monitoring", icon: <Monitor size={20} />, href: "/ai-monitoring" },
    { name: "Vets", icon: <Stethoscope size={20} />, href: "/vets" },
    { name: "Appointment", icon: <CalendarCheck size={20} />, href: "/appointments" },

    // ✅ NEW PRODUCTS SECTION
    { name: "Products", icon: <Package size={20} />, href: "/products" },
  ];

  const systemItems = [
    { name: "Notification", icon: <Bell size={20} />, href: "/notifications" },
    { name: "Payments", icon: <CreditCard size={20} />, href: "/payments" },
    { name: "Report", icon: <BarChart3 size={20} />, href: "/reports" },
    { name: "Settings", icon: <Settings size={20} />, href: "/settings" },
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
        {/* Logo */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Pashuvaani</h1>
            <p className="text-[10px] text-gray-300 tracking-widest uppercase font-semibold">
              Admin Console
            </p>
          </div>

          <button
            className="md:hidden text-gray-300 hover:text-white p-1 rounded-md active:bg-white/10"
            onClick={() => setIsOpen?.(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-gray-200 hover:bg-white/10 hover:text-white rounded-lg transition-colors font-medium text-sm"
            >
              {item.icon}
              {item.name}
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