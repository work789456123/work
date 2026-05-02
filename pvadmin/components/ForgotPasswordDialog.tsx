"use client";

import { useState, useEffect } from "react";

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
  apiBaseUrl = "http://localhost:8000",
}: ForgotPasswordDialogProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusMsg>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep("email");
        setEmail("");
        setOtp("");
        setResetToken("");
        setNewPw("");
        setConfirmPw("");
        setStatus(null);
        setCooldown(0);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const post = async (path: string, body: object) => {
    const res = await fetch(`${apiBaseUrl}/api${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = typeof data.detail === "string" ? data.detail : "Request failed.";
      if (res.status === 429) {
        const ra = res.headers.get("retry-after");
        setCooldown(ra ? parseInt(ra) : 60);
      }
      throw new Error(msg);
    }
    return data;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      await post("/auth/forgot-password", { email });
      setStep("otp");
      setCooldown(60);
    } catch (err: unknown) {
      setStatus({ type: "error", text: err instanceof Error ? err.message : "Failed to send OTP." });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const data = await post("/auth/verify-otp", { email, otp });
      setResetToken(data.reset_token);
      setStep("reset");
    } catch (err: unknown) {
      setStatus({ type: "error", text: err instanceof Error ? err.message : "Invalid OTP." });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setStatus(null);
    setLoading(true);
    try {
      await post("/auth/forgot-password", { email });
      setOtp("");
      setCooldown(60);
      setStatus({ type: "success", text: "A new OTP has been sent." });
    } catch (err: unknown) {
      setStatus({ type: "error", text: err instanceof Error ? err.message : "Could not resend OTP." });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setStatus({ type: "error", text: "Passwords do not match." });
      return;
    }
    setStatus(null);
    setLoading(true);
    try {
      await post("/auth/reset-password", {
        reset_token: resetToken,
        new_password: newPw,
        confirm_password: confirmPw,
      });
      setStep("success");
    } catch (err: unknown) {
      setStatus({ type: "error", text: err instanceof Error ? err.message : "Could not update password." });
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
            {step === "otp" && "Verify OTP"}
            {step === "reset" && "Set New Password"}
            {step === "success" && "All Done!"}
          </h2>
          <p className="text-sm text-white/80 mt-1">
            {step === "email" && "Enter your registered email to receive an OTP."}
            {step === "otp" && "Enter the 6-digit code sent to your inbox."}
            {step === "reset" && "Choose a strong new password (min. 8 characters)."}
            {step === "success" && "Your password has been updated successfully."}
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
            <form onSubmit={handleSendOTP} className="space-y-4">
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
                {loading ? "Sending…" : "Send OTP"}
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
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <p className="text-sm text-slate-600">
                OTP sent to <strong className="text-[#1F6559]">{email}</strong>. Expires in 7 minutes.
              </p>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                autoComplete="one-time-code"
                className={`${inputClass} text-center text-2xl tracking-[1rem] font-bold`}
              />
              <button type="submit" disabled={loading || otp.length !== 6} className={btnClass}>
                {loading ? "Verifying…" : "Verify OTP"}
              </button>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setStep("email"); setStatus(null); setOtp(""); }}
                  className="text-sm text-slate-500 hover:text-[#1F6559] transition"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || loading}
                  className="text-sm font-semibold text-[#1F6559] hover:underline disabled:opacity-40 transition"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="password"
                placeholder="New password (min 8 chars)"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className={inputClass}
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                required
                autoComplete="new-password"
                className={`${inputClass} ${confirmPw && newPw !== confirmPw ? "border-red-400 ring-1 ring-red-300" : ""}`}
              />
              {confirmPw && newPw !== confirmPw && (
                <p className="text-xs text-red-500">Passwords do not match.</p>
              )}
              <button
                type="submit"
                disabled={loading || newPw.length < 8 || newPw !== confirmPw}
                className={btnClass}
              >
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1F6559]/10">
                <span className="text-3xl">✅</span>
              </div>
              <p className="text-slate-600 text-sm">You can now sign in with your new password.</p>
              <button
                onClick={() => {
                  onOpenChange(false);
                  onBackToLogin?.();
                }}
                className={btnClass}
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
