import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	authDialog,
	authRoles,
	petDialog,
	settingTypeLabels,
} from "@/assets/content/shared/auth_ui";
import { brand } from "@/assets/content/shared/brand";
import type {
	NavbarAuthDialogProps,
	NavbarPetDialogProps,
	NavbarPetData,
} from "@/types/navbar";
import { cn } from "@/lib/utils";
import {
	ChevronDown,
	Eye,
	EyeOff,
	LogIn,
	PawPrint,
	Sparkles,
	Stethoscope,
	Store,
	UserCircle,
	UserPlus,
	X,
	ChevronRight,
	Plus,
	MapPin,
	Home,
} from "lucide-react";

const OTHER_VALUE = "__other__";

const fieldInputClass =
	"h-11 rounded-xl border-[#E2E8E5] bg-[#FAFAFA]/90 shadow-sm transition-colors placeholder:text-muted-foreground/80 focus-visible:border-[#1F6559]/35 focus-visible:ring-[#1F6559]/30";

const selectTriggerClass = cn(
	"h-11 w-full rounded-xl border-[#E2E8E5] bg-[#FAFAFA]/90 shadow-sm focus:ring-2 focus:ring-[#1F6559]/30 focus:ring-offset-0",
);

const dialogHeaderClass = "relative overflow-hidden bg-[#1F6559] text-white";

const primaryButtonClass =
	"heading-font h-11 w-full rounded-xl bg-[#1F6559] font-semibold text-white shadow-sm transition hover:bg-[#184F46] sm:flex-1";

const primarySubmitAuthClass =
	"heading-font mt-1 h-12 w-full rounded-xl bg-[#1F6559] text-base font-semibold text-white shadow-sm transition hover:bg-[#184F46]";

function FieldGroup({ className, ...props }: ComponentProps<"div">) {
	return <div className={cn("space-y-2", className)} {...props} />;
}

type PetSelectWithOtherProps = {
	label: string;
	triggerId: string;
	otherInputId: string;
	presets: string[];
	placeholder: string;
	otherPlaceholder: string;
	otherLabel: string;
	stored: string;
	onStoredChange: (v: string) => void;
	otherActive: boolean;
	onOtherActiveChange: (v: boolean) => void;
	selectTestId?: string;
	otherInputTestId?: string;
	requireStored?: boolean;
};

function PetSelectWithOther({
	label,
	triggerId,
	otherInputId,
	presets,
	placeholder,
	otherPlaceholder,
	otherLabel,
	stored,
	onStoredChange,
	otherActive,
	onOtherActiveChange,
	selectTestId,
	otherInputTestId,
	requireStored,
}: PetSelectWithOtherProps) {
	const selectValue =
		!otherActive && stored && presets.includes(stored) ? stored : undefined;

	const handleReset = () => {
		onOtherActiveChange(false);
		onStoredChange("");
	};

	return (
		<FieldGroup>
			<div className="flex min-h-[1.25rem] items-center justify-between gap-2">
				<Label
					htmlFor={otherActive ? otherInputId : triggerId}
					className="text-[#333] transition-all"
				>
					{label}
				</Label>
				{otherActive && (
					<button
						type="button"
						onClick={handleReset}
						title="Back to select"
						className="group flex items-center gap-1 rounded-full border border-[#1F6559] bg-[#1F6559]/5 px-2.5 py-0.5 text-[11px] font-semibold text-[#1F6559] transition-all hover:border-[#1F6559]/80 hover:bg-[#1F6559]/10"
					>
						<ChevronDown className="h-3 w-3 opacity-70 transition-transform group-hover:-rotate-90" />
						{otherLabel}
						<X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
					</button>
				)}
			</div>

			{requireStored && (
				<input
					readOnly
					required
					value={stored}
					aria-hidden
					tabIndex={-1}
					className="sr-only pointer-events-none absolute m-0 h-px w-px overflow-hidden border-0 p-0 opacity-0"
				/>
			)}

			{otherActive ? (
				<Input
					id={otherInputId}
					data-testid={otherInputTestId}
					value={stored}
					onChange={(e) => onStoredChange(e.target.value)}
					required={requireStored}
					placeholder={otherPlaceholder}
					autoFocus
					className={cn(
						fieldInputClass,
						"border-[#1F6559]/35 ring-0 focus-visible:border-[#1F6559]/60 focus-visible:ring-[#1F6559]/25",
					)}
				/>
			) : (
				<Select
					value={selectValue}
					onValueChange={(v) => {
						if (v === OTHER_VALUE) {
							onOtherActiveChange(true);
							onStoredChange("");
						} else {
							onOtherActiveChange(false);
							onStoredChange(v);
						}
					}}
				>
					<SelectTrigger
						id={triggerId}
						data-testid={selectTestId}
						className={selectTriggerClass}
					>
						<SelectValue placeholder={placeholder} />
					</SelectTrigger>
					<SelectContent>
						{presets.map((p) => (
							<SelectItem key={p} value={p}>
								{p}
							</SelectItem>
						))}
						<SelectItem value={OTHER_VALUE}>{otherLabel}</SelectItem>
					</SelectContent>
				</Select>
			)}
		</FieldGroup>
	);
}

// ─── Role icon map ──────────────────────────────────────────────────────────
const roleIconMap = {
	UserCircle: UserCircle,
	Stethoscope: Stethoscope,
	Store: Store,
};

// ─── NavbarAuthDialog ───────────────────────────────────────────────────────

export function NavbarAuthDialog({
	open,
	onOpenChange,
	authMode,
	formData,
	onFieldChange,
	onToggleMode,
	onSubmit,
}: NavbarAuthDialogProps) {
	const [showPassword, setShowPassword] = useState(false);
	const isLogin = authMode === "login";

	useEffect(() => {
		if (!open) setShowPassword(false);
	}, [open]);

	useEffect(() => {
		setShowPassword(false);
	}, [authMode]);

	const goLogin = () => {
		if (!isLogin) onToggleMode();
	};
	const goRegister = () => {
		if (isLogin) onToggleMode();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				id="navbar-dialog-auth"
				data-testid="auth-dialog"
				className="gap-0 overflow-hidden border-[#C7D3CC]/70 p-0 shadow-2xl shadow-[#1F6559]/10 sm:max-w-[420px]"
			>
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
						<div className="flex items-start gap-3">
							<div
								className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30"
								aria-hidden
							>
								{isLogin ? (
									<LogIn className="h-5 w-5 text-white" strokeWidth={2} />
								) : (
									<UserPlus className="h-5 w-5 text-white" strokeWidth={2} />
								)}
							</div>
							<div className="min-w-0 flex-1 space-y-1 pt-0.5">
								<DialogTitle className="heading-font text-xl font-bold leading-tight text-white sm:text-2xl">
									{isLogin ? authDialog.loginTitle : authDialog.registerTitle}
								</DialogTitle>
								<DialogDescription className="text-sm leading-relaxed text-white/95">
									{isLogin
										? authDialog.loginSubtitle
										: authDialog.registerSubtitle}
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>

					<div
						className="relative mt-5 flex rounded-2xl bg-black/15 p-1 ring-1 ring-white/25 backdrop-blur-sm"
						role="tablist"
						aria-label="Authentication mode"
					>
						<button
							type="button"
							role="tab"
							aria-selected={isLogin}
							data-testid="auth-mode-login"
							onClick={goLogin}
							className={cn(
								"heading-font relative flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all",
								isLogin
									? "bg-white text-[#1F6559] shadow-md"
									: "text-white/95 hover:bg-white/15 hover:text-white",
							)}
						>
							{authDialog.submitLogin}
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={!isLogin}
							data-testid="auth-mode-register"
							onClick={goRegister}
							className={cn(
								"heading-font relative flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all",
								!isLogin
									? "bg-white text-[#1F6559] shadow-md"
									: "text-white/95 hover:bg-white/15 hover:text-white",
							)}
						>
							{authDialog.submitRegister}
						</button>
					</div>
				</div>

				<div className="bg-white px-6 pb-6 pt-5">
					<form id="navbar-form-auth" onSubmit={onSubmit} className="space-y-4">
						{/* Role selector — register only */}
						{!isLogin && (
							<FieldGroup>
								<Label className="text-[#333]">I am a</Label>
								<div
									className="grid grid-cols-3 gap-2"
									role="radiogroup"
									aria-label="Account type"
								>
									{authRoles.map((role) => {
										const Icon =
											roleIconMap[role.icon as keyof typeof roleIconMap];
										const isSelected = formData.role === role.value;
										return (
											<button
												key={role.value}
												type="button"
												role="radio"
												aria-checked={isSelected}
												data-testid={`auth-role-${role.value}`}
												onClick={() => onFieldChange("role", role.value)}
												className={cn(
													"group flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all",
													isSelected
														? "border-[#1F6559] bg-[#1F6559]/5 ring-2 ring-[#1F6559]/25"
														: "border-[#E2E8E5] bg-[#FAFAFA] hover:border-[#1F6559]/40 hover:bg-[#1F6559]/5",
												)}
											>
												<div
													className={cn(
														"flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
														isSelected
															? "bg-[#1F6559] text-white"
															: "bg-[#E2E8E5] text-[#6F6F6F] group-hover:bg-[#1F6559]/15 group-hover:text-[#1F6559]",
													)}
												>
													<Icon className="h-4 w-4" strokeWidth={2} />
												</div>
												<span
													className={cn(
														"heading-font text-[11px] font-semibold leading-tight",
														isSelected ? "text-[#1F6559]" : "text-[#6F6F6F]",
													)}
												>
													{role.label}
												</span>
											</button>
										);
									})}
								</div>
							</FieldGroup>
						)}

						{!isLogin && (
							<FieldGroup>
								<Label htmlFor="navbar-auth-full_name" className="text-[#333]">
									{authDialog.labels.fullName}
								</Label>
								<Input
									id="navbar-auth-full_name"
									data-testid="auth-fullname-input"
									value={formData.full_name}
									onChange={(e) => onFieldChange("full_name", e.target.value)}
									required
									autoComplete="name"
									className={fieldInputClass}
								/>
							</FieldGroup>
						)}
						<FieldGroup>
							<Label
								htmlFor="navbar-auth-phone_or_email"
								className="text-[#333]"
							>
								{authDialog.labels.phoneOrEmail}
							</Label>
							<Input
								id="navbar-auth-phone_or_email"
								data-testid="auth-phone-email-input"
								value={formData.phone_or_email}
								onChange={(e) =>
									onFieldChange("phone_or_email", e.target.value)
								}
								required
								autoComplete="username"
								className={fieldInputClass}
							/>
						</FieldGroup>
						<FieldGroup>
							<Label htmlFor="navbar-auth-password" className="text-[#333]">
								{authDialog.labels.password}
							</Label>
							<div className="relative">
								<Input
									id="navbar-auth-password"
									type={showPassword ? "text" : "password"}
									data-testid="auth-password-input"
									value={formData.password}
									onChange={(e) => onFieldChange("password", e.target.value)}
									required
									autoComplete={isLogin ? "current-password" : "new-password"}
									className={cn(fieldInputClass, "pr-11")}
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									data-testid="auth-password-visibility"
									className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 rounded-lg text-[#6F6F6F] hover:bg-[#1F6559]/10 hover:text-[#1F6559]"
									onClick={() => setShowPassword((s) => !s)}
									aria-label={
										showPassword
											? authDialog.labels.hidePassword
											: authDialog.labels.showPassword
									}
									aria-pressed={showPassword}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
						</FieldGroup>
						<Button
							type="submit"
							data-testid="auth-submit-button"
							className={primarySubmitAuthClass}
						>
							{isLogin ? authDialog.submitLogin : authDialog.submitRegister}
						</Button>
						<p className="pt-1 text-center text-sm leading-relaxed text-[#6F6F6F]">
							{isLogin ? authDialog.toggleToRegister : authDialog.toggleToLogin}
							<button
								type="button"
								onClick={onToggleMode}
								className="heading-font ml-1 font-semibold text-[#1F6559] underline-offset-4 transition hover:text-[#184F46] hover:underline"
								data-testid="auth-toggle-button"
							>
								{isLogin ? authDialog.toggleSignUp : authDialog.toggleLogin}
							</button>
						</p>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
}

// ─── Pet Dialog helpers ─────────────────────────────────────────────────────

const emptyPet = (): NavbarPetData => ({
	name: "",
	pet_type: "",
	age: "",
	gender: "",
	weight: "",
	petCount: "",
});

type PetCardProps = {
	pet: NavbarPetData;
	index: number;
	total: number;
	isActive: boolean;
	isUrban: boolean;
	petTypeOther: boolean;
	weightOther: boolean;
	petCountOther: boolean;
	onActivate: () => void;
	onRemove: () => void;
	onFieldChange: (field: keyof NavbarPetData, value: string) => void;
	onPetTypeOtherChange: (v: boolean) => void;
	onWeightOtherChange: (v: boolean) => void;
	onPetCountOtherChange: (v: boolean) => void;
};

function CollapsedPetCard({
	pet,
	index,
	onActivate,
	onRemove,
}: {
	pet: NavbarPetData;
	index: number;
	onActivate: () => void;
	onRemove: (e: React.MouseEvent) => void;
}) {
	const chips = [pet.age, pet.gender, pet.weight].filter(Boolean);
	const displayName =
		pet.name ||
		(pet.petCount && pet.petCount !== "1"
			? `${pet.petCount} ${pet.pet_type || "animals"}`
			: pet.pet_type || `Animal ${index + 1}`);

	return (
		<button
			type="button"
			onClick={onActivate}
			className="group w-full rounded-2xl border border-[#E2E8E5] bg-[#FAFAFA]/80 px-4 py-3 text-left transition-all hover:border-[#1F6559]/40 hover:bg-white hover:shadow-sm"
		>
			<div className="flex items-center gap-3">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1F6559]/10 text-[#1F6559]">
					<PawPrint className="h-4 w-4" strokeWidth={2} />
				</div>
				<div className="min-w-0 flex-1">
					<p className="heading-font truncate text-sm font-semibold text-[#1F1F1F]">
						{displayName}
					</p>
					{chips.length > 0 && (
						<div className="mt-1 flex flex-wrap gap-1">
							{chips.map((c) => (
								<span
									key={c}
									className="inline-block rounded-full bg-[#1F6559]/8 px-2 py-0.5 text-[10px] font-medium text-[#1F6559]"
								>
									{c}
								</span>
							))}
						</div>
					)}
				</div>
				<div className="flex shrink-0 items-center gap-1">
					<ChevronRight className="h-4 w-4 text-[#6F6F6F] transition-transform group-hover:translate-x-0.5" />
					<button
						type="button"
						onClick={onRemove}
						className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-[#6F6F6F] transition-colors hover:bg-red-50 hover:text-red-500"
						aria-label="Remove pet"
					>
						<X className="h-3 w-3" />
					</button>
				</div>
			</div>
		</button>
	);
}

function ExpandedPetCard({
	pet,
	index,
	total,
	isUrban,
	petTypeOther,
	weightOther,
	petCountOther,
	onFieldChange,
	onPetTypeOtherChange,
	onWeightOtherChange,
	onPetCountOtherChange,
}: Omit<PetCardProps, "isActive" | "onActivate" | "onRemove">) {
	const pt = petDialog;
	const showPetCount = !isUrban;
	const petCountIsMultiple =
		!isUrban && pet.petCount !== "" && pet.petCount !== "1";

	return (
		<div className="rounded-2xl border-2 border-[#1F6559]/25 bg-white shadow-sm">
			<div className="flex items-center justify-between border-b border-[#E2E8E5] px-4 py-3">
				<div className="flex items-center gap-2">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1F6559] text-white">
						<PawPrint className="h-3.5 w-3.5" strokeWidth={2.5} />
					</div>
					<span className="heading-font text-xs font-semibold uppercase tracking-wider text-[#1F6559]">
						Animal {index + 1}
						{total > 1 && ` of ${total}`}
					</span>
				</div>
			</div>

			<div className="space-y-4 p-4">
				{/* Rural petCount */}
				{showPetCount && (
					<PetSelectWithOther
						label={pt.labels.petCount}
						triggerId={`navbar-pet-count-select-${index}`}
						otherInputId={`navbar-pet-count-other-${index}`}
						presets={pt.petCountOptions.filter((o) => o !== "10+")}
						placeholder={pt.placeholders.selectPetCount}
						otherPlaceholder={pt.placeholders.specifyPetCount}
						otherLabel="10+"
						stored={pet.petCount}
						onStoredChange={(v) => onFieldChange("petCount", v)}
						otherActive={petCountOther}
						onOtherActiveChange={onPetCountOtherChange}
						selectTestId={`pet-count-select-${index}`}
						otherInputTestId={`pet-count-input-${index}`}
						requireStored={false}
					/>
				)}

				{/* Name field */}
				{!petCountIsMultiple && (
					<div className="grid gap-4 sm:grid-cols-2">
						<FieldGroup>
							<Label
								htmlFor={`navbar-pet-name-${index}`}
								className="text-[#333]"
							>
								{pt.labels.name}
								{isUrban && <span className="ml-1 text-red-500">*</span>}
								{!isUrban && (
									<span className="ml-1 text-[#aaa] text-[10px] font-normal">
										(optional)
									</span>
								)}
							</Label>
							<Input
								id={`navbar-pet-name-${index}`}
								data-testid={`pet-name-input-${index}`}
								value={pet.name}
								onChange={(e) => onFieldChange("name", e.target.value)}
								required={isUrban}
								autoComplete="off"
								className={fieldInputClass}
							/>
						</FieldGroup>
						<PetSelectWithOther
							label={pt.labels.type}
							triggerId={`navbar-pet-type-select-${index}`}
							otherInputId={`navbar-pet-type-other-${index}`}
							presets={pt.petTypeOptions}
							placeholder={pt.placeholders.selectPetType}
							otherPlaceholder={pt.placeholders.specifyPetType}
							otherLabel={pt.otherOption}
							stored={pet.pet_type}
							onStoredChange={(v) => onFieldChange("pet_type", v)}
							otherActive={petTypeOther}
							onOtherActiveChange={onPetTypeOtherChange}
							selectTestId={`pet-type-select-${index}`}
							otherInputTestId={`pet-type-input-${index}`}
							requireStored
						/>
					</div>
				)}

				{/* When multiple, only show pet type */}
				{petCountIsMultiple && (
					<PetSelectWithOther
						label={pt.labels.type}
						triggerId={`navbar-pet-type-select-${index}`}
						otherInputId={`navbar-pet-type-other-${index}`}
						presets={pt.petTypeOptions}
						placeholder={pt.placeholders.selectPetType}
						otherPlaceholder={pt.placeholders.specifyPetType}
						otherLabel={pt.otherOption}
						stored={pet.pet_type}
						onStoredChange={(v) => onFieldChange("pet_type", v)}
						otherActive={petTypeOther}
						onOtherActiveChange={onPetTypeOtherChange}
						selectTestId={`pet-type-select-${index}`}
						otherInputTestId={`pet-type-input-${index}`}
						requireStored
					/>
				)}

				{/* Details row */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<FieldGroup>
						<Label htmlFor={`navbar-pet-age-${index}`} className="text-[#333]">
							{pt.labels.age}
						</Label>
						<Input
							id={`navbar-pet-age-${index}`}
							data-testid={`pet-age-input-${index}`}
							placeholder={pt.labels.agePlaceholder}
							value={pet.age}
							onChange={(e) => onFieldChange("age", e.target.value)}
							className={fieldInputClass}
						/>
					</FieldGroup>
					<PetSelectWithOther
						label={pt.labels.gender}
						triggerId={`navbar-pet-gender-select-${index}`}
						otherInputId={`navbar-pet-gender-other-${index}`}
						presets={pt.genderOptions}
						placeholder={pt.placeholders.selectGender}
						otherPlaceholder={pt.placeholders.specifyGender}
						otherLabel={pt.otherOption}
						stored={pet.gender}
						onStoredChange={(v) => onFieldChange("gender", v)}
						otherActive={false}
						onOtherActiveChange={() => {}}
						selectTestId={`pet-gender-select-${index}`}
						otherInputTestId={`pet-gender-input-${index}`}
					/>
					<PetSelectWithOther
						label={pt.labels.weight}
						triggerId={`navbar-pet-weight-select-${index}`}
						otherInputId={`navbar-pet-weight-other-${index}`}
						presets={pt.weightOptions}
						placeholder={pt.placeholders.selectWeight}
						otherPlaceholder={pt.placeholders.specifyWeight}
						otherLabel={pt.otherOption}
						stored={pet.weight}
						onStoredChange={(v) => onFieldChange("weight", v)}
						otherActive={weightOther}
						onOtherActiveChange={onWeightOtherChange}
						selectTestId={`pet-weight-select-${index}`}
						otherInputTestId={`pet-weight-input-${index}`}
					/>
				</div>
			</div>
		</div>
	);
}

// ─── NavbarPetDialog ────────────────────────────────────────────────────────

export function NavbarPetDialog({
	open,
	onOpenChange,
	onSubmit,
	onSkip,
}: NavbarPetDialogProps) {
	const [settingType, setSettingType] = useState<"urban" | "rural">("urban");
	const [pets, setPets] = useState<NavbarPetData[]>([emptyPet()]);
	const [activePetIdx, setActivePetIdx] = useState(0);

	// Per-pet "other" selection state
	const [petTypeOthers, setPetTypeOthers] = useState<boolean[]>([false]);
	const [weightOthers, setWeightOthers] = useState<boolean[]>([false]);
	const [petCountOthers, setPetCountOthers] = useState<boolean[]>([false]);

	const wasOpenRef = useRef(false);

	// Reset when dialog opens fresh
	useEffect(() => {
		if (open && !wasOpenRef.current) {
			const fresh = emptyPet();
			setPets([fresh]);
			setActivePetIdx(0);
			setPetTypeOthers([false]);
			setWeightOthers([false]);
			setPetCountOthers([false]);
			setSettingType("urban");
		}
		wasOpenRef.current = open;
	}, [open]);

	const handleSettingTypeChange = (v: "urban" | "rural") => {
		setSettingType(v);
		setPets([emptyPet()]);
		setActivePetIdx(0);
		setPetTypeOthers([false]);
		setWeightOthers([false]);
		setPetCountOthers([false]);
	};

	const updatePetField = (
		idx: number,
		field: keyof NavbarPetData,
		value: string,
	) => {
		setPets((prev) =>
			prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)),
		);
	};

	const addPet = () => {
		const newIdx = pets.length;
		setPets((prev) => [...prev, emptyPet()]);
		setPetTypeOthers((prev) => [...prev, false]);
		setWeightOthers((prev) => [...prev, false]);
		setPetCountOthers((prev) => [...prev, false]);
		setActivePetIdx(newIdx);
	};

	const removePet = (idx: number) => {
		if (pets.length === 1) return;
		setPets((prev) => prev.filter((_, i) => i !== idx));
		setPetTypeOthers((prev) => prev.filter((_, i) => i !== idx));
		setWeightOthers((prev) => prev.filter((_, i) => i !== idx));
		setPetCountOthers((prev) => prev.filter((_, i) => i !== idx));
		setActivePetIdx((prev) => Math.min(prev, pets.length - 2));
	};

	const canAddAnother = pets.some((p) => p.pet_type !== "");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(pets, settingType);
	};

	const pt = petDialog;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				id="navbar-dialog-pet"
				data-testid="add-pet-dialog"
				className="gap-0 overflow-hidden border-[#C7D3CC]/70 p-0 shadow-2xl shadow-[#1F6559]/10 sm:max-w-[560px]"
			>
				{/* Header */}
				<div className={cn(dialogHeaderClass, "px-6 pb-6 pt-6")}>
					<div
						className="pointer-events-none absolute right-6 top-4 h-20 w-20 rounded-full bg-white/20 blur-2xl"
						aria-hidden
					/>
					<DialogHeader className="relative space-y-3 text-left">
						<div className="flex items-start gap-3">
							<div
								className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/35"
								aria-hidden
							>
								<PawPrint className="h-6 w-6 text-white" strokeWidth={2} />
							</div>
							<div className="min-w-0 flex-1 space-y-1.5">
								<DialogTitle className="heading-font text-xl font-bold leading-tight text-white sm:text-2xl">
									{pt.title}
								</DialogTitle>
								<DialogDescription className="flex items-start gap-2 text-sm leading-relaxed text-white/95">
									<Sparkles
										className="mt-0.5 h-4 w-4 shrink-0 text-amber-100"
										aria-hidden
									/>
									<span>{pt.subtitle}</span>
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>

					{/* Urban / Rural toggle */}
					<div
						className="relative mt-5 flex rounded-2xl bg-black/15 p-1 ring-1 ring-white/25 backdrop-blur-sm"
						role="tablist"
						aria-label="Setting type"
					>
						{(["urban", "rural"] as const).map((type) => {
							const isActive = settingType === type;
							const Icon = type === "urban" ? Home : MapPin;
							return (
								<button
									key={type}
									type="button"
									role="tab"
									aria-selected={isActive}
									onClick={() => handleSettingTypeChange(type)}
									className={cn(
										"heading-font relative flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all",
										isActive
											? "bg-white text-[#1F6559] shadow-md"
											: "text-white/95 hover:bg-white/15 hover:text-white",
									)}
								>
									<Icon className="h-3.5 w-3.5" strokeWidth={2} />
									<span>{settingTypeLabels[type].label}</span>
									<span
										className={cn(
											"text-[10px] font-normal opacity-70",
											isActive ? "text-[#1F6559]" : "text-white/70",
										)}
									>
										{settingTypeLabels[type].description}
									</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Body */}
				<div className="max-h-[60vh] overflow-y-auto bg-white px-6 pb-2 pt-5">
					<form id="navbar-form-pet" onSubmit={handleSubmit}>
						<div className="space-y-3">
							{pets.map((pet, idx) =>
								idx === activePetIdx ? (
									<ExpandedPetCard
										key={idx}
										pet={pet}
										index={idx}
										total={pets.length}
										isUrban={settingType === "urban"}
										petTypeOther={petTypeOthers[idx] ?? false}
										weightOther={weightOthers[idx] ?? false}
										petCountOther={petCountOthers[idx] ?? false}
										onFieldChange={(field, value) =>
											updatePetField(idx, field, value)
										}
										onPetTypeOtherChange={(v) =>
											setPetTypeOthers((prev) =>
												prev.map((x, i) => (i === idx ? v : x)),
											)
										}
										onWeightOtherChange={(v) =>
											setWeightOthers((prev) =>
												prev.map((x, i) => (i === idx ? v : x)),
											)
										}
										onPetCountOtherChange={(v) =>
											setPetCountOthers((prev) =>
												prev.map((x, i) => (i === idx ? v : x)),
											)
										}
									/>
								) : (
									<CollapsedPetCard
										key={idx}
										pet={pet}
										index={idx}
										onActivate={() => setActivePetIdx(idx)}
										onRemove={(e) => {
											e.stopPropagation();
											removePet(idx);
										}}
									/>
								),
							)}
						</div>

						{/* Add another */}
						{canAddAnother && (
							<button
								type="button"
								onClick={addPet}
								className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#1F6559]/40 bg-[#1F6559]/3 px-4 py-3 text-sm font-semibold text-[#1F6559] transition-all hover:border-[#1F6559]/70 hover:bg-[#1F6559]/8"
							>
								<Plus className="h-4 w-4" strokeWidth={2.5} />
								{pt.addAnother}
							</button>
						)}

						{/* Spacer so buttons aren't clipped */}
						<div className="h-4" />
					</form>
				</div>

				{/* Footer */}
				<div className="border-t border-[#E2E8E5] bg-white px-6 pb-6 pt-4">
					<div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
						<Button
							type="button"
							variant="outline"
							onClick={onSkip}
							data-testid="pet-skip-button"
							className="h-11 w-full rounded-xl border-[#E2E8E5] bg-transparent font-medium text-[#333] hover:border-[#1F6559]/40 hover:bg-[#FAFAFA] sm:flex-1"
						>
							{pt.skip}
						</Button>
						<Button
							type="submit"
							form="navbar-form-pet"
							data-testid="pet-submit-button"
							className={primaryButtonClass}
						>
							{pets.length > 1
								? `${pt.submit} (${pets.length})`
								: pt.submitSingle}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
