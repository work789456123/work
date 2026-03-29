import type { FormEvent } from "react";

export type NavbarAuthFormData = {
  full_name: string;
  phone_or_email: string;
  password: string;
};

export type NavbarPetData = {
  name: string;
  pet_type: string;
  age: string;
  gender: string;
  weight: string;
};

export type NavbarState = {
  showAuth: boolean;
  authMode: "login" | "register";
  isLoggedIn: boolean;
  showAddPet: boolean;
  mobileMenuOpen: boolean;
  rakshaOpen: boolean;
  formData: NavbarAuthFormData;
  petData: NavbarPetData;
};

export type NavbarAction =
  | { type: "SET_LOGGED_IN"; value: boolean }
  | { type: "SET_SHOW_AUTH"; value: boolean }
  | { type: "SHOW_AUTH" }
  | { type: "HIDE_AUTH" }
  | { type: "SET_AUTH_MODE"; value: "login" | "register" }
  | { type: "TOGGLE_AUTH_MODE" }
  | { type: "SET_SHOW_ADD_PET"; value: boolean }
  | { type: "SET_MOBILE_MENU"; value: boolean }
  | { type: "TOGGLE_MOBILE_MENU" }
  | { type: "SET_RAKSHA_OPEN"; value: boolean }
  | { type: "TOGGLE_RAKSHA" }
  | { type: "SET_FORM_FIELD"; field: keyof NavbarAuthFormData; value: string }
  | { type: "RESET_AUTH_FORM" }
  | { type: "SET_PET_FIELD"; field: keyof NavbarPetData; value: string }
  | { type: "RESET_PET_FORM" }
  | { type: "AUTH_SUCCESS"; showPetDialog?: boolean }
  | { type: "LOGOUT" };

export type NavbarAuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authMode: "login" | "register";
  formData: NavbarAuthFormData;
  onFieldChange: (field: keyof NavbarAuthFormData, value: string) => void;
  onToggleMode: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export type NavbarPetDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  petData: NavbarPetData;
  onFieldChange: (field: keyof NavbarPetData, value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onSkip: () => void;
};

export type NavbarToolbarProps = {
  mobileMenuOpen: boolean;
  onToggleMobile: () => void;
  isLoggedIn: boolean;
  onGopuClick: () => void;
  onLogout: () => void;
  onOpenAuth: () => void;
};

export type NavbarMobileMenuProps = {
  open: boolean;
  rakshaOpen: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onToggleRaksha: () => void;
  onGopuClick: () => void;
  onLogout: () => void;
  onOpenAuth: () => void;
};
