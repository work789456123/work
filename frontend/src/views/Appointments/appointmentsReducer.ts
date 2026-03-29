import type { AppointmentAction, AppointmentFormData, AppointmentState } from "@/types/appointments";

export const initialAppointmentForm: AppointmentFormData = {
  pet_name: "",
  pet_type: "",
  gender: "",
  age: "",
  weight: "",
  weight_unit: "KG",
  owner_name: "",
  owner_number: "",
  vaccination_status: false,
  medical_history_available: false,
  medical_history: "",
  time_slot: "",
};

export const initialAppointmentState: AppointmentState = {
  showPopup: false,
  form: { ...initialAppointmentForm },
};

export function appointmentsReducer(
  state: AppointmentState,
  action: AppointmentAction
): AppointmentState {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
      };
    case "SUBMIT_SUCCESS":
      return {
        showPopup: true,
        form: {
          ...initialAppointmentForm,
          age: "NA",
        },
      };
    case "CLOSE_POPUP":
      return { ...state, showPopup: false };
    default:
      return state;
  }
}
