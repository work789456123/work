"use client";

import { useState } from "react";
import { ForgotPasswordDialog } from "@/components/ForgotPasswordDialog";

export default function AuthPage() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.detail === "string" ? data.detail : "Invalid admin credentials.");
        return;
      }
      if (data.access_token) {
        localStorage.setItem("admin_token", data.access_token);
        localStorage.setItem("admin_role", data.admin.role);
        localStorage.setItem("admin_name", data.admin.full_name || "Admin");
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 sm:p-6">
        <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row min-h-[480px]">

          {/* Banner Section */}
          <div className="flex w-full flex-col justify-center bg-[#1F6559] p-8 text-white md:w-1/2">
            <div className="mx-auto max-w-xs text-center">
              <div className="mb-6 flex justify-center">
                {/* PashuVaani logo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/pvhalflogo.png"
                  alt="PashuVaani Logo"
                  className="h-20 w-auto object-contain drop-shadow-md"
                />
              </div>
              <h2 className="text-3xl font-bold">PashuVaani</h2>
              <p className="mt-3 text-sm opacity-80">Admin Portal</p>
              <p className="mt-6 text-xs opacity-60">Restricted access — authorised personnel only.</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex w-full flex-col justify-center p-8 md:w-1/2">
            <div className="mx-auto w-full max-w-sm">
              <h2 className="mb-2 text-center text-3xl font-bold text-slate-800">Admin Sign In</h2>
              <p className="mb-8 text-center text-sm text-slate-400">Enter your admin credentials to continue</p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border bg-slate-50 p-4 outline-none focus:ring-2 focus:ring-[#1F6559]"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border bg-slate-50 p-4 outline-none focus:ring-2 focus:ring-[#1F6559]"
                />

                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    id="pvadmin-forgot-password-link"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs font-semibold text-[#1F6559] underline-offset-4 transition hover:text-[#184F46] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full rounded-xl bg-[#1F6559] py-4 font-bold text-white shadow-lg shadow-[#1F6559]/20 transition-all active:scale-[0.98] disabled:opacity-60"
                >
                  {loading ? "Signing in…" : "SIGN IN"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>

      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
        onBackToLogin={() => setShowForgotPassword(false)}
        apiBaseUrl={API_URL}
      />
    </>
  );
}
