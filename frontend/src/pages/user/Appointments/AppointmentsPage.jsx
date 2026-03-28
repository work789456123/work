import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { appointmentsPage } from "@/assets/appointments";
import AppointmentsFormBody from "./components/AppointmentsFormBody";
import { appointmentsReducer, initialAppointmentState } from "./appointmentsReducer";

function AppointmentsPage() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(appointmentsReducer, initialAppointmentState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("To continue with this feature please log in");
      navigate("/");
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("openAuthModal"));
      }, 100);
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...state.form,
      weight: state.form.weight ? `${state.form.weight} ${state.form.weight_unit}` : "NA",
    };
    console.log(submitData);
    dispatch({ type: "SUBMIT_SUCCESS" });
  };

  const c = appointmentsPage;

  return (
    <div className="container mx-auto p-6 py-20 bg-gradient-to-b from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]/10 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-white mb-10">{c.pageTitle}</h1>

      <AppointmentsFormBody
        form={state.form}
        onFieldChange={(field, value) => dispatch({ type: "SET_FIELD", field, value })}
        onSubmit={handleSubmit}
      />

      {state.showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-teal-50 p-8 rounded-xl shadow-lg text-center w-80">
            <h2 className="text-2xl font-bold text-green-600 mb-3">{c.successPopup.title}</h2>
            <p className="text-gray-600 mb-6">{c.successPopup.message}</p>
            <button
              type="button"
              onClick={() => dispatch({ type: "CLOSE_POPUP" })}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              {c.successPopup.ok}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;
