"use client";

import { useState, useEffect } from "react";

type Mode = "admin" | "superadmin";
type Step = "email" | "otp" | "reset" | "success";
type StatusMsg = { type: "error" | "success"; text: string } | null;

export interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackToLogin?: () => void;
  apiBaseUrl?: string;
}

export function ForgotPasswordDialog({
  open,
  onOpenChange,
  onBackToLogin,
  apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
}: ForgotPasswordDialogProps) {
  const [mode, setMode] = useState<Mode>("admin");
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusMsg>(null);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setMode("admin");
        setStep("email");
        setEmail("");
        setOtp("");
        setResetToken("");
        setNewPassword("");
        setConfirmPassword("");
        setStatus(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    if (mode === "admin") {
      try {
        const res = await fetch(`${apiBaseUrl}/api/admin/password-reset-ticket`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(typeof data.detail === "string" ? data.detail : "Request failed.");
        }
        setStep("success");
      } catch (err: unknown) {
        setStatus({ type: "error", text: err instanceof Error ? err.message : "Failed to submit ticket." });
      } finally {
        setLoading(false);
      }
    } else {
      // Superadmin OTP flow - Request OTP
      try {
        const res = await fetch(`${apiBaseUrl}/api/auth/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, role: "superadmin" }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(typeof data.detail === "string" ? data.detail : "Request failed.");
        }
        setStatus({ type: "success", text: "OTP sent to your email." });
        setStep("otp");
      } catch (err: unknown) {
        setStatus({ type: "error", text: err instanceof Error ? err.message : "Failed to send OTP." });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(typeof data.detail === "string" ? data.detail : "Verification failed.");
      }
      setResetToken(data.reset_token);
      setStatus(null);
      setStep("reset");
    } catch (err: unknown) {
      setStatus({ type: "error", text: err instanceof Error ? err.message : "Invalid OTP." });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset_token: resetToken, new_password: newPassword, confirm_password: confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(typeof data.detail === "string" ? data.detail : "Reset failed.");
      }
      setStep("success");
    } catch (err: unknown) {
      setStatus({ type: "error", text: err instanceof Error ? err.message : "Failed to reset password." });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const inputClass =
    "w-full rounded-xl border bg-slate-50 p-4 outline-none focus:ring-2 focus:ring-[#1F6559] text-sm";
  const btnClass =
    "w-full rounded-xl bg-[#1F6559] py-3 font-bold text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-sm";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#1F6559] px-6 pt-6 pb-10 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/15 blur-2xl" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 mb-2">
            PashuVaani Admin
          </p>
          <h2 className="text-2xl font-bold text-white">
            {step === "email" && "Forgot Password?"}
            {step === "otp" && "Enter OTP"}
            {step === "reset" && "Set New Password"}
            {step === "success" && (mode === "admin" ? "Ticket Submitted" : "Password Reset")}
          </h2>
          <p className="text-sm text-white/80 mt-1">
            {step === "email" && mode === "admin" && "Submit a ticket to the super admin to request a password reset."}
            {step === "email" && mode === "superadmin" && "We will send an OTP to your registered email to reset your password."}
            {step === "otp" && "Please enter the 6-digit OTP sent to your email."}
            {step === "reset" && "Create a new strong password for your account."}
            {step === "success" && mode === "admin" && "Your request has been received."}
            {step === "success" && mode === "superadmin" && "Your password has been changed successfully."}
          </p>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {step === "email" && (
            <div className="flex rounded-xl bg-slate-100 p-1 mb-4">
              <button
                type="button"
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                  mode === "admin" ? "bg-white text-[#1F6559] shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setMode("admin")}
              >
                Admin
              </button>
              <button
                type="button"
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                  mode === "superadmin" ? "bg-white text-[#1F6559] shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setMode("superadmin")}
              >
                Super Admin
              </button>
            </div>
          )}

          {status && (
            <div
              className={`rounded-xl border px-3 py-2.5 text-sm ${
                status.type === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {status.text}
            </div>
          )}

          {step === "email" && (
            <form onSubmit={handleSubmitEmail} className="space-y-4">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={inputClass}
              />
              <button type="submit" disabled={loading} className={btnClass}>
                {loading ? "Please wait…" : mode === "admin" ? "Submit Ticket" : "Send OTP"}
              </button>
              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full text-sm text-slate-500 hover:text-[#1F6559] transition"
              >
                ← Back to Sign In
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                className={inputClass}
              />
              <button type="submit" disabled={loading} className={btnClass}>
                {loading ? "Verifying…" : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-sm text-slate-500 hover:text-[#1F6559] transition"
              >
                ← Change Email
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className={inputClass}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className={inputClass}
              />
              <button type="submit" disabled={loading} className={btnClass}>
                {loading ? "Resetting…" : "Reset Password"}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1F6559]/10">
                <span className="text-3xl">✅</span>
              </div>
              <p className="text-slate-600 text-sm">
                {mode === "admin"
                  ? "A password reset ticket has been sent to the super admin. They will contact you shortly."
                  : "Your password has been successfully reset. You can now login with your new password."}
              </p>
              <button
                onClick={() => {
                  onOpenChange(false);
                  onBackToLogin?.();
                }}
                className={btnClass}
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
