/** Route: /appointments */
export const appointmentsPage = {
  pageTitle: "Book Veterinary Appointment",
  formTitle: "Appointment Form",
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
    medicalHistoryWarning: "⚠️ Please bring the medical History",
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
