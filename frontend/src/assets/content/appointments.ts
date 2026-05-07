/** Route: /appointments */
export const appointmentsPage = {
  pageTitle: "Book Veterinary Appointment",
  pageSubtitle:
    "Share a few details about your pet and pick a time that works for you. We will follow up to confirm your visit.",
  formTitle: "Appointment details",
  formDescription: "Fields marked as required help us prepare for your appointment.",
  sections: {
    pet: "About your pet",
    owner: "Your contact",
    visit: "Visit & health",
  },
  placeholders: {
    petName: "Pet Name",
    petType: "Pet Type (Dog, Cow, Cat...)",
    gender: "Select Gender",
    age: "Age",
    weight: "Weight",
    ownerName: "Owner Name",
    ownerPhone: "Owner Phone",
    timeSlot: "Select Time Slot",
    medicalNote: "want say something write here",
  },
  genderOptions: [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ],
  weightUnits: ["KG", "LBS"],
  labels: {
    vaccinated: "Pet is Vaccinated",
    medicalHistoryAvailable: "Medical History Available",
    medicalHistoryWarning: "Please bring the medical history to your visit.",
    medicalHistoryNotes: "Notes for the veterinarian",
  },
  submit: "Book Appointment",
  successPopup: {
    title: "✅ Success",
    message: "Appointment Booked Successfully!",
    ok: "OK",
  },
  langToggle: {
    switchToHindi: "हिंदी में भरें",
    switchToEnglish: "Fill in English",
  },
};

/** Hindi translations for the appointments page */
export const appointmentsPageHindi = {
  pageTitle: "पशु चिकित्सा अपॉइंटमेंट बुक करें",
  pageSubtitle:
    "अपने पशु के बारे में कुछ जानकारी दें और अपनी सुविधा के अनुसार समय चुनें। हम आपकी विज़िट की पुष्टि के लिए संपर्क करेंगे।",
  formTitle: "अपॉइंटमेंट विवरण",
  formDescription: "आवश्यक फ़ील्ड भरने से हमें आपकी अपॉइंटमेंट की तैयारी में मदद मिलती है।",
  sections: {
    pet: "आपके पशु के बारे में",
    owner: "आपका संपर्क",
    visit: "विज़िट और स्वास्थ्य",
  },
  placeholders: {
    petName: "पशु का नाम",
    petType: "पशु का प्रकार (कुत्ता, गाय, बिल्ली...)",
    gender: "लिंग चुनें",
    age: "उम्र",
    weight: "वज़न",
    ownerName: "मालिक का नाम",
    ownerPhone: "मालिक का फ़ोन नंबर",
    timeSlot: "समय स्लॉट चुनें",
    medicalNote: "यहाँ कुछ लिखना हो तो लिखें",
  },
  genderOptions: [
    { value: "", label: "लिंग चुनें" },
    { value: "Male", label: "नर" },
    { value: "Female", label: "मादा" },
  ],
  weightUnits: ["KG", "LBS"],
  labels: {
    vaccinated: "पशु का टीकाकरण हो चुका है",
    medicalHistoryAvailable: "चिकित्सा इतिहास उपलब्ध है",
    medicalHistoryWarning: "कृपया विज़िट के समय चिकित्सा इतिहास साथ लाएं।",
    medicalHistoryNotes: "पशु चिकित्सक के लिए नोट्स",
  },
  submit: "अपॉइंटमेंट बुक करें",
  successPopup: {
    title: "✅ सफलता",
    message: "अपॉइंटमेंट सफलतापूर्वक बुक हो गई!",
    ok: "ठीक है",
  },
  langToggle: {
    switchToHindi: "हिंदी में भरें",
    switchToEnglish: "Fill in English",
  },
};

export const appointmentTimeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];
