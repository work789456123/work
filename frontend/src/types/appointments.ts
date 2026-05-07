import type { FormEvent } from "react";

export type AppointmentFormData = {
  pet_name: string;
  pet_type: string;
  gender: string;
  age: string;
  weight: string;
  weight_unit: string;
  owner_name: string;
  owner_number: string;
  vaccination_status: boolean;
  medical_history_available: boolean;
  medical_history: string;
  time_slot: string;
};

export type AppointmentState = {
  showPopup: boolean;
  form: AppointmentFormData;
};

export type AppointmentAction =
  | {
      type: "SET_FIELD";
      field: keyof AppointmentFormData;
      value: AppointmentFormData[keyof AppointmentFormData];
    }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "CLOSE_POPUP" };

export type AppointmentLang = "en" | "hi";

export type AppointmentsFormBodyProps = {
  form: AppointmentFormData;
  onFieldChange: <K extends keyof AppointmentFormData>(field: K, value: AppointmentFormData[K]) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  lang: AppointmentLang;
  onLangToggle: () => void;
};
