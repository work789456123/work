/** Navbar auth & pet dialogs — copy only */

export const authRoles = [
	{
		value: "user" as const,
		label: "Pet Owner",
		description: "Manage your animals & book vet visits",
		icon: "UserCircle",
	},
	{
		value: "doctor" as const,
		label: "Veterinarian",
		description: "List your practice, manage consultations",
		icon: "Stethoscope",
	},
	{
		value: "vendor" as const,
		label: "Vendor",
		description: "Sell pet products & supplies",
		icon: "Store",
	},
];

export const settingTypeLabels = {
	urban: {
		label: "Urban",
		description: "Household pets",
	},
	rural: {
		label: "Rural",
		description: "Farm & livestock",
	},
};

export const authDialog = {
	loginTitle: "Welcome Back",
	registerTitle: "Create Account",
	loginSubtitle: "Sign in to book visits, use Gopu, and manage your pets.",
	registerSubtitle:
		"A few details and you are ready — add pets anytime after signup.",
	labels: {
		fullName: "Full Name",
		phoneOrEmail: "Phone or Email",
		password: "Password",
		showPassword: "Show password",
		hidePassword: "Hide password",
	},
	submitLogin: "Login",
	submitRegister: "Sign Up",
	toggleToRegister: "Don't have an account? ",
	toggleToLogin: "Already have an account? ",
	toggleSignUp: "Sign Up",
	toggleLogin: "Login",
};

export const petDialog = {
	title: "Add Your Pet/Animal",
	subtitle: "Meet your personal animal health AI agent",
	otherOption: "Other",
	placeholders: {
		selectPetType: "Select pet type",
		selectGender: "Select gender",
		selectWeight: "Select weight",
		selectPetCount: "How many?",
		specifyPetType: "Specify pet type",
		specifyGender: "Specify gender",
		specifyWeight: "Specify weight (e.g. 12 kg)",
		specifyPetCount: "Enter number of animals",
	},
	labels: {
		name: "Pet Name",
		type: "Pet Type",
		typePlaceholder: "Dog, Cat, etc.",
		age: "Age",
		agePlaceholder: "2 years",
		gender: "Gender",
		genderPlaceholder: "Male/Female",
		weight: "Weight",
		weightPlaceholder: "10 kg",
		petCount: "No. of Animals",
	},
	petTypeOptions: ["Dog", "Cat", "Cow", "Buffalo", "Goat", "Sheep", "Bird"],
	genderOptions: ["Male", "Female"],
	weightOptions: [
		"5 kg",
		"10 kg",
		"15 kg",
		"20 kg",
		"25 kg",
		"30 kg",
		"35 kg",
		"40 kg",
	],
	petCountOptions: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"],
	submit: "Save Animals",
	submitSingle: "Add Pet",
	addAnother: "+ Add Another Animal",
	skip: "Skip for Now",
};

export const navbarActions = {
	tryGopu: "Try Gopu.AI Free",
	logout: "Logout",
	loginSignup: "Login / Sign up",
};
