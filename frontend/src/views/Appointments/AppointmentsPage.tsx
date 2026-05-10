"use client";

import { useEffect, useReducer, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarHeart } from "lucide-react";
import { appointmentsPage, appointmentsPageHindi } from "@/assets/content/appointments";
import { brand } from "@/assets/content/shared/brand";
import AppointmentsFormBody from "./components/AppointmentsFormBody";
import {
	appointmentsReducer,
	initialAppointmentState,
} from "./appointmentsReducer";
import UserPageShell from "@/motion/UserPageShell";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/PageTitle";
import PawTexture from "@/components/PawTexture";
import api from "@/utils/api";
import type { AppointmentLang } from "@/types/appointments";

function AppointmentsPage() {
	const router = useRouter();
	const [state, dispatch] = useReducer(
		appointmentsReducer,
		initialAppointmentState,
	);
	const [lang, setLang] = useState<AppointmentLang>("en");

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("To continue with this feature please log in");
			router.push("/");
			setTimeout(() => {
				window.dispatchEvent(new CustomEvent("openAuthModal"));
			}, 100);
		}
	}, [router]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const submitData = {
			...state.form,
			weight: state.form.weight
				? `${state.form.weight} ${state.form.weight_unit}`
				: "NA",
		};
		try {
			await api.post("/appointments", submitData);
			dispatch({ type: "SUBMIT_SUCCESS" });
		} catch {
			toast.error("Failed to book appointment. Please try again.");
		}
	};

	const c = lang === "hi" ? appointmentsPageHindi : appointmentsPage;

	return (
		<UserPageShell id="page-appointments" className="min-h-screen bg-teal-100/50">
			<PageTitle
				id="appointments-hero"
				className="relative overflow-hidden bg-gradient-to-b from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]/10 pb-16 pt-12 md:pb-20 md:pt-16"
			>
				<div
					className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl md:h-96 md:w-96"
					aria-hidden
				/>
				<div
					className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[#1F6559]/20 blur-3xl"
					aria-hidden
				/>

				<div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
					<div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/20 backdrop-blur-sm md:h-16 md:w-16">
						<CalendarHeart
							className="h-7 w-7 text-white md:h-8 md:w-8"
							strokeWidth={1.75}
							aria-hidden
						/>
					</div>
					<p className="heading-font mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
						{brand.name}
					</p>
					<h1
						id="appointments-page-title"
						className="heading-font text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
					>
						{c.pageTitle}
					</h1>
					<p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/95 md:text-lg">
						{c.pageSubtitle}
					</p>
				</div>
			</PageTitle>

			<section
				id="appointments-form-section"
				className="relative z-10 -mt-8 px-4 pb-16 pt-0 sm:px-6 md:-mt-10 md:pb-24"
			>
				<PawTexture />
				<div className="mx-auto max-w-3xl">
					<AppointmentsFormBody
						form={state.form}
						onFieldChange={(field, value) =>
							dispatch({ type: "SET_FIELD", field, value })
						}
						onSubmit={handleSubmit}
						lang={lang}
						onLangToggle={() => setLang((prev) => (prev === "en" ? "hi" : "en"))}
					/>
				</div>
			</section>

			<Dialog
				open={state.showPopup}
				onOpenChange={(open) => !open && dispatch({ type: "CLOSE_POPUP" })}
			>
				<DialogContent
					id="appointments-success-dialog"
					className="border-[#C7D3CC]/80 bg-white sm:max-w-md"
				>
					<DialogHeader>
						<DialogTitle className="heading-font text-xl text-[#1F6559] md:text-2xl">
							{c.successPopup.title}
						</DialogTitle>
						<DialogDescription className="text-base text-[#6F6F6F]">
							{c.successPopup.message}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="sm:justify-center">
						<Button
							type="button"
							onClick={() => dispatch({ type: "CLOSE_POPUP" })}
							className="w-full bg-gradient-to-r from-[#1FA7A6] to-[#1F6559] text-white shadow-md hover:opacity-95 sm:w-auto sm:min-w-[120px]"
						>
							{c.successPopup.ok}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</UserPageShell>
	);
}

export default AppointmentsPage;
