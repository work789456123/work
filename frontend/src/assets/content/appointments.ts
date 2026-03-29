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
