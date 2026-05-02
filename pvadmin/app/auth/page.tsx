"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { ForgotPasswordDialog } from "@/components/ForgotPasswordDialog";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin
        ? { phone_or_email: formData.email, password: formData.password }
        : { full_name: formData.full_name, phone_or_email: formData.email, password: formData.password, role: "admin" };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.detail === "string" ? data.detail : "Authentication failed.");
        return;
      }
      if (data.access_token) {
        localStorage.setItem("admin_token", data.access_token);
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
        <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row min-h-[550px]">

          {/* Banner Section */}
          <div className={`flex w-full flex-col justify-center bg-[#1F6559] p-8 text-white transition-all duration-500 md:w-1/2 ${isLogin ? "md:order-1" : "md:order-2"}`}>
            <div className="mx-auto max-w-xs text-center">
              <h2 className="text-3xl font-bold">{isLogin ? "Welcome Back!" : "Hello, Friend!"}</h2>
              <p className="my-6 text-sm opacity-80">{isLogin ? "Stay connected with us by logging in." : "Start your journey with Pashuvaani today."}</p>
              <button
                onClick={() => { setIsLogin(!isLogin); setError(""); }}
                className="rounded-full border-2 border-white px-8 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:bg-white hover:text-[#1F6559] active:scale-95"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>

          {/* Form Section */}
          <div className={`flex w-full flex-col justify-center p-8 md:w-1/2 ${isLogin ? "md:order-2" : "md:order-1"}`}>
            <div className="mx-auto w-full max-w-sm">
              <h2 className="mb-8 text-center text-3xl font-bold text-slate-800">{isLogin ? "Sign In" : "Create Account"}</h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required={!isLogin}
                    className="w-full rounded-xl border bg-slate-50 p-4 outline-none focus:ring-2 focus:ring-[#1F6559]"
                  />
                )}
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
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="w-full rounded-xl border bg-slate-50 p-4 outline-none focus:ring-2 focus:ring-[#1F6559]"
                />

                {/* Forgot Password link */}
                {isLogin && (
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
                )}

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
                  {loading ? "Please wait…" : isLogin ? "SIGN IN" : "SIGN UP"}
                </button>
              </form>

              {/* Forgot Password link on signup too */}
              <p className="mt-4 text-center text-xs text-slate-400">
                <button
                  type="button"
                  id={`pvadmin-forgot-${isLogin ? "login" : "register"}`}
                  onClick={() => setShowForgotPassword(true)}
                  className="underline-offset-4 transition hover:text-[#1F6559] hover:underline"
                >
                  Forgot Password?
                </button>
              </p>
            </div>
          </div>

        </div>
      </main>

      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
        onBackToLogin={() => {
          setShowForgotPassword(false);
          setIsLogin(true);
        }}
        apiBaseUrl={API_URL}
      />
    </>
  );
}