"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname?.startsWith("/auth");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token && !isAuthPage) {
      // Not logged in and trying to access a protected page → go to login
      router.replace("/auth");
    } else if (token && isAuthPage) {
      // Already logged in and visiting the auth page → go to dashboard
      router.replace("/dashboard");
    } else {
      setAuthChecked(true);
    }
  }, [isAuthPage, router]);

  // Don't render anything until the auth check is done to avoid flash
  if (!authChecked && !isAuthPage) {
    return null;
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden w-full h-full relative z-10">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
