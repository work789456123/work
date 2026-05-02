"use client";

import { useState, useEffect } from "react";
import { isAxiosError } from "axios";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
	KeyRound,
	Mail,
	ShieldCheck,
	Eye,
	EyeOff,
	ArrowLeft,
	RefreshCw,
	CheckCircle2,
	AlertCircle,
	Loader2,
} from "lucide-react";
import api from "@/utils/api";
import { brand } from "@/assets/content/shared/brand";

// ── Shared style tokens ──────────────────────────────────────────────────────
const fieldInputClass =
	"h-11 rounded-xl border-[#E2E8E5] bg-[#FAFAFA]/90 shadow-sm transition-colors placeholder:text-muted-foreground/80 focus-visible:border-[#1F6559]/35 focus-visible:ring-[#1F6559]/30";

const primaryButtonClass =
	"heading-font mt-1 h-12 w-full rounded-xl bg-[#1F6559] text-base font-semibold text-white shadow-sm transition hover:bg-[#184F46] disabled:opacity-60 disabled:cursor-not-allowed";

const dialogHeaderClass = "relative overflow-hidden bg-[#1F6559] text-white";

function FieldGroup({ children }: { children: React.ReactNode }) {
	return <div className="space-y-2">{children}</div>;
}

type Step = "email" | "otp" | "reset" | "success";

type StatusMsg = { type: "error" | "success"; text: string } | null;

// ── Internal step views ───────────────────────────────────────────────────────

function StepEmail({
	email,
	setEmail,
	loading,
	status,
	onSubmit,
	onBack,
}: {
	email: string;
	setEmail: (v: string) => void;
	loading: boolean;
	status: StatusMsg;
	onSubmit: (e: React.FormEvent) => void;
	onBack: () => void;
}) {
	return (
		<form onSubmit={onSubmit} className="space-y-4">
			<FieldGroup>
				<Label htmlFor="fp-email" className="text-[#333]">
					Registered Email
				</Label>
				<div className="relative">
					<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F6F6F]" />
					<Input
						id="fp-email"
						type="email"
						placeholder="you@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						autoComplete="email"
						className={cn(fieldInputClass, "pl-9")}
					/>
				</div>
			</FieldGroup>

			{status && (
				<StatusBanner type={status.type} text={status.text} />
			)}

			<Button
				type="submit"
				disabled={loading}
				className={primaryButtonClass}
				id="fp-send-otp-btn"
			>
				{loading ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : null}
				{loading ? "Sending OTP…" : "Send OTP"}
			</Button>

			<BackLink onClick={onBack} />
		</form>
	);
}

function StepOTP({
	email,
	otp,
	setOtp,
	loading,
	status,
	cooldown,
	onSubmit,
	onResend,
	onBack,
}: {
	email: string;
	otp: string;
	setOtp: (v: string) => void;
	loading: boolean;
	status: StatusMsg;
	cooldown: number;
	onSubmit: (e: React.FormEvent) => void;
	onResend: () => void;
	onBack: () => void;
}) {
	return (
		<form onSubmit={onSubmit} className="space-y-4">
			<p className="text-sm text-[#6F6F6F] leading-relaxed">
				A 6-digit OTP was sent to{" "}
				<span className="font-semibold text-[#1F6559]">{email}</span>. It
				expires in 7 minutes.
			</p>

			<FieldGroup>
				<Label htmlFor="fp-otp" className="text-[#333]">
					Enter OTP
				</Label>
				<Input
					id="fp-otp"
					type="text"
					inputMode="numeric"
					maxLength={6}
					placeholder="• • • • • •"
					value={otp}
					onChange={(e) =>
						setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
					}
					required
					autoComplete="one-time-code"
					className={cn(
						fieldInputClass,
						"text-center text-2xl tracking-[1rem] font-bold",
					)}
				/>
			</FieldGroup>

			{status && (
				<StatusBanner type={status.type} text={status.text} />
			)}

			<Button
				type="submit"
				disabled={loading || otp.length !== 6}
				className={primaryButtonClass}
				id="fp-verify-otp-btn"
			>
				{loading ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : null}
				{loading ? "Verifying…" : "Verify OTP"}
			</Button>

			<div className="flex items-center justify-between pt-1">
				<BackLink onClick={onBack} />
				<button
					type="button"
					onClick={onResend}
					disabled={cooldown > 0 || loading}
					className="flex items-center gap-1 text-xs font-semibold text-[#1F6559] underline-offset-4 transition hover:text-[#184F46] hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
					id="fp-resend-btn"
				>
					<RefreshCw className="h-3 w-3" />
					{cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
				</button>
			</div>
		</form>
	);
}

function StepReset({
	loading,
	status,
	onSubmit,
}: {
	loading: boolean;
	status: StatusMsg;
	onSubmit: (e: React.FormEvent, newPw: string, confirmPw: string) => void;
}) {
	const [newPw, setNewPw] = useState("");
	const [confirmPw, setConfirmPw] = useState("");
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const mismatch = confirmPw.length > 0 && newPw !== confirmPw;
	const tooShort = newPw.length > 0 && newPw.length < 8;

	return (
		<form
			onSubmit={(e) => onSubmit(e, newPw, confirmPw)}
			className="space-y-4"
		>
			<p className="text-sm text-[#6F6F6F] leading-relaxed">
				Choose a strong new password (at least 8 characters).
			</p>

			<FieldGroup>
				<Label htmlFor="fp-new-pw" className="text-[#333]">
					New Password
				</Label>
				<div className="relative">
					<Input
						id="fp-new-pw"
						type={showNew ? "text" : "password"}
						placeholder="Min. 8 characters"
						value={newPw}
						onChange={(e) => setNewPw(e.target.value)}
						required
						minLength={8}
						autoComplete="new-password"
						className={cn(
							fieldInputClass,
							"pr-11",
							tooShort && "border-red-400 focus-visible:border-red-400",
						)}
					/>
					<button
						type="button"
						onClick={() => setShowNew((s) => !s)}
						className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#6F6F6F] hover:bg-[#1F6559]/10 hover:text-[#1F6559]"
						aria-label={showNew ? "Hide password" : "Show password"}
					>
						{showNew ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
				{tooShort && (
					<p className="text-xs text-red-500">
						Password must be at least 8 characters.
					</p>
				)}
			</FieldGroup>

			<FieldGroup>
				<Label htmlFor="fp-confirm-pw" className="text-[#333]">
					Confirm Password
				</Label>
				<div className="relative">
					<Input
						id="fp-confirm-pw"
						type={showConfirm ? "text" : "password"}
						placeholder="Re-enter password"
						value={confirmPw}
						onChange={(e) => setConfirmPw(e.target.value)}
						required
						autoComplete="new-password"
						className={cn(
							fieldInputClass,
							"pr-11",
							mismatch && "border-red-400 focus-visible:border-red-400",
						)}
					/>
					<button
						type="button"
						onClick={() => setShowConfirm((s) => !s)}
						className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#6F6F6F] hover:bg-[#1F6559]/10 hover:text-[#1F6559]"
						aria-label={showConfirm ? "Hide password" : "Show password"}
					>
						{showConfirm ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
				{mismatch && (
					<p className="text-xs text-red-500">Passwords do not match.</p>
				)}
			</FieldGroup>

			{status && (
				<StatusBanner type={status.type} text={status.text} />
			)}

			<Button
				type="submit"
				disabled={loading || mismatch || tooShort || !newPw || !confirmPw}
				className={primaryButtonClass}
				id="fp-reset-pw-btn"
			>
				{loading ? (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				) : null}
				{loading ? "Updating…" : "Update Password"}
			</Button>
		</form>
	);
}

function StepSuccess({ onLogin }: { onLogin: () => void }) {
	return (
		<div className="flex flex-col items-center gap-4 py-4 text-center">
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1F6559]/10">
				<CheckCircle2 className="h-8 w-8 text-[#1F6559]" strokeWidth={2} />
			</div>
			<div>
				<p className="text-base font-semibold text-[#1F1F1F]">
					Password updated!
				</p>
				<p className="mt-1 text-sm text-[#6F6F6F]">
					You can now sign in with your new password.
				</p>
			</div>
			<Button
				onClick={onLogin}
				className={cn(primaryButtonClass, "mt-2 max-w-xs")}
				id="fp-go-login-btn"
			>
				Sign In
			</Button>
		</div>
	);
}

// ── Small utility sub-components ─────────────────────────────────────────────

function StatusBanner({ type, text }: { type: "error" | "success"; text: string }) {
	const isError = type === "error";
	return (
		<div
			className={cn(
				"flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm",
				isError
					? "border-red-200 bg-red-50 text-red-700"
					: "border-emerald-200 bg-emerald-50 text-emerald-700",
			)}
		>
			{isError ? (
				<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
			) : (
				<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
			)}
			<span>{text}</span>
		</div>
	);
}

function BackLink({ onClick }: { onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex items-center gap-1 text-xs font-semibold text-[#6F6F6F] underline-offset-4 transition hover:text-[#1F6559] hover:underline"
		>
			<ArrowLeft className="h-3 w-3" />
			Back to sign in
		</button>
	);
}

// ── Step header config ────────────────────────────────────────────────────────

const stepConfig: Record<
	Step,
	{ icon: React.ElementType; title: string; description: string }
> = {
	email: {
		icon: KeyRound,
		title: "Forgot Password?",
		description: "Enter your registered email and we'll send you an OTP.",
	},
	otp: {
		icon: ShieldCheck,
		title: "Verify OTP",
		description: "Enter the 6-digit code sent to your inbox.",
	},
	reset: {
		icon: KeyRound,
		title: "Set New Password",
		description: "Almost there! Choose a strong new password.",
	},
	success: {
		icon: CheckCircle2,
		title: "All Done!",
		description: "Your password has been reset successfully.",
	},
};

// ── Main component ────────────────────────────────────────────────────────────

export interface ForgotPasswordDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Called when the user wants to go back to the sign-in form */
	onBackToLogin: () => void;
}

export function ForgotPasswordDialog({
	open,
	onOpenChange,
	onBackToLogin,
}: ForgotPasswordDialogProps) {
	const [step, setStep] = useState<Step>("email");
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [resetToken, setResetToken] = useState("");
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState<StatusMsg>(null);
	const [cooldown, setCooldown] = useState(0);

	// Reset internal state when dialog closes
	useEffect(() => {
		if (!open) {
			setTimeout(() => {
				setStep("email");
				setEmail("");
				setOtp("");
				setResetToken("");
				setStatus(null);
				setCooldown(0);
			}, 300); // wait for close animation
		}
	}, [open]);

	// Countdown timer for resend button
	useEffect(() => {
		if (cooldown <= 0) return;
		const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
		return () => clearTimeout(t);
	}, [cooldown]);

	// ── Step 1: request OTP ──────────────────────────────────────────────────
	const handleSendOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus(null);
		setLoading(true);
		try {
			await api.post("/auth/forgot-password", { email });
			setStep("otp");
			setCooldown(60);
		} catch (err: unknown) {
			const msg = extractErrorMessage(err, "Failed to send OTP. Please try again.");
			if (isAxiosError(err) && err.response?.status === 429) {
				const retryAfter = parseInt(
					(err.response.headers?.["retry-after"] as string) ?? "60",
					10,
				);
				setCooldown(retryAfter);
			}
			setStatus({ type: "error", text: msg });
		} finally {
			setLoading(false);
		}
	};

	// ── Step 1 resend (from OTP screen) ─────────────────────────────────────
	const handleResend = async () => {
		if (cooldown > 0) return;
		setStatus(null);
		setLoading(true);
		try {
			await api.post("/auth/forgot-password", { email });
			setOtp("");
			setCooldown(60);
			setStatus({ type: "success", text: "A new OTP has been sent." });
		} catch (err: unknown) {
			const msg = extractErrorMessage(err, "Could not resend OTP.");
			if (isAxiosError(err) && err.response?.status === 429) {
				const retryAfter = parseInt(
					(err.response.headers?.["retry-after"] as string) ?? "60",
					10,
				);
				setCooldown(retryAfter);
			}
			setStatus({ type: "error", text: msg });
		} finally {
			setLoading(false);
		}
	};

	// ── Step 2: verify OTP ───────────────────────────────────────────────────
	const handleVerifyOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus(null);
		setLoading(true);
		try {
			const res = await api.post<{ reset_token: string }>(
				"/auth/verify-otp",
				{ email, otp },
			);
			setResetToken(res.data.reset_token);
			setStep("reset");
		} catch (err: unknown) {
			setStatus({
				type: "error",
				text: extractErrorMessage(err, "Invalid or expired OTP."),
			});
		} finally {
			setLoading(false);
		}
	};

	// ── Step 3: reset password ───────────────────────────────────────────────
	const handleResetPassword = async (
		e: React.FormEvent,
		newPassword: string,
		confirmPassword: string,
	) => {
		e.preventDefault();
		setStatus(null);
		setLoading(true);
		try {
			await api.post("/auth/reset-password", {
				reset_token: resetToken,
				new_password: newPassword,
				confirm_password: confirmPassword,
			});
			setStep("success");
		} catch (err: unknown) {
			setStatus({
				type: "error",
				text: extractErrorMessage(err, "Could not update password. Please start over."),
			});
		} finally {
			setLoading(false);
		}
	};

	const handleBackToLogin = () => {
		onOpenChange(false);
		onBackToLogin();
	};

	const cfg = stepConfig[step];
	const Icon = cfg.icon;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				id="navbar-dialog-forgot-password"
				data-testid="forgot-password-dialog"
				className="gap-0 overflow-hidden border-[#C7D3CC]/70 p-0 shadow-2xl shadow-[#1F6559]/10 sm:max-w-[420px]"
			>
				{/* ── Header ─────────────────────────────────────────────── */}
				<div className={cn(dialogHeaderClass, "px-6 pb-10 pt-6")}>
					<div
						className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15 blur-2xl"
						aria-hidden
					/>
					<div
						className="pointer-events-none absolute -bottom-10 left-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"
						aria-hidden
					/>
					<p className="relative text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
						{brand.name}
					</p>
					<DialogHeader className="relative space-y-3 text-left">
						<div className="flex items-start gap-3 mt-2">
							<div
								className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30"
								aria-hidden
							>
								<Icon className="h-5 w-5 text-white" strokeWidth={2} />
							</div>
							<div className="min-w-0 flex-1 space-y-1 pt-0.5">
								<DialogTitle className="heading-font text-xl font-bold leading-tight text-white sm:text-2xl">
									{cfg.title}
								</DialogTitle>
								<DialogDescription className="text-sm leading-relaxed text-white/95">
									{cfg.description}
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>
				</div>

				{/* ── Body ────────────────────────────────────────────────── */}
				<div className="bg-white px-6 pb-6 pt-5">
					{step === "email" && (
						<StepEmail
							email={email}
							setEmail={setEmail}
							loading={loading}
							status={status}
							onSubmit={handleSendOTP}
							onBack={handleBackToLogin}
						/>
					)}
					{step === "otp" && (
						<StepOTP
							email={email}
							otp={otp}
							setOtp={setOtp}
							loading={loading}
							status={status}
							cooldown={cooldown}
							onSubmit={handleVerifyOTP}
							onResend={handleResend}
							onBack={() => {
								setStep("email");
								setStatus(null);
								setOtp("");
							}}
						/>
					)}
					{step === "reset" && (
						<StepReset
							loading={loading}
							status={status}
							onSubmit={handleResetPassword}
						/>
					)}
					{step === "success" && (
						<StepSuccess onLogin={handleBackToLogin} />
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

// ── Utility ───────────────────────────────────────────────────────────────────

function extractErrorMessage(err: unknown, fallback: string): string {
	if (isAxiosError(err) && err.response?.data) {
		const data = err.response.data as Record<string, unknown>;
		if (typeof data.detail === "string") return data.detail;
		if (Array.isArray(data.detail) && data.detail[0]?.msg)
			return data.detail[0].msg as string;
	}
	return fallback;
}
