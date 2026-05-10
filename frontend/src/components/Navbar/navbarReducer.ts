import type { NavbarAction, NavbarState } from "@/types/navbar";

export const initialNavbarState: NavbarState = {
	showAuth: false,
	authMode: "login",
	isLoggedIn: false,
	showAddPet: false,
	mobileMenuOpen: false,
	rakshaOpen: false,
	formData: {
		full_name: "",
		phone_or_email: "",
		email: "",
		phone: "",
		password: "",
		role: "user",
	},
	petData: {
		name: "",
		pet_type: "",
		age: "",
		gender: "",
		weight: "",
		petCount: "",
	},
};

export function navbarReducer(
	state: NavbarState,
	action: NavbarAction,
): NavbarState {
	switch (action.type) {
		case "SET_LOGGED_IN":
			return { ...state, isLoggedIn: action.value };
		case "SET_SHOW_AUTH":
			return { ...state, showAuth: action.value };
		case "SHOW_AUTH":
			return { ...state, showAuth: true };
		case "HIDE_AUTH":
			return { ...state, showAuth: false };
		case "SET_AUTH_MODE":
			return { ...state, authMode: action.value };
		case "TOGGLE_AUTH_MODE":
			return {
				...state,
				authMode: state.authMode === "login" ? "register" : "login",
			};
		case "SET_SHOW_ADD_PET":
			return { ...state, showAddPet: action.value };
		case "SET_MOBILE_MENU":
			return { ...state, mobileMenuOpen: action.value };
		case "TOGGLE_MOBILE_MENU":
			return { ...state, mobileMenuOpen: !state.mobileMenuOpen };
		case "SET_RAKSHA_OPEN":
			return { ...state, rakshaOpen: action.value };
		case "TOGGLE_RAKSHA":
			return { ...state, rakshaOpen: !state.rakshaOpen };
		case "SET_FORM_FIELD":
			return {
				...state,
				formData: { ...state.formData, [action.field]: action.value },
			};
		case "RESET_AUTH_FORM":
			return { ...state, formData: { ...initialNavbarState.formData } };
		case "SET_PET_FIELD":
			return {
				...state,
				petData: { ...state.petData, [action.field]: action.value },
			};
		case "RESET_PET_FORM":
			return { ...state, petData: { ...initialNavbarState.petData } };
		case "AUTH_SUCCESS":
			return {
				...state,
				isLoggedIn: true,
				showAuth: false,
				formData: { ...initialNavbarState.formData },
				showAddPet: Boolean(action.showPetDialog),
			};
		case "LOGOUT":
			return {
				...state,
				isLoggedIn: false,
				formData: { ...initialNavbarState.formData },
				petData: { ...initialNavbarState.petData },
			};
		default:
			return state;
	}
}
