import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function AppointmentsPage() {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("To continue with this feature please log in");
      navigate("/");
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openAuthModal'));
      }, 100);
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
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
    time_slot: ""
  });

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      weight: formData.weight
        ? `${formData.weight} ${formData.weight_unit}`
        : "NA"
    };

    console.log(submitData);

    setShowPopup(true);

    setFormData({
      pet_name: "",
      pet_type: "",
      gender: "",
      age: "NA",
      weight: "",
      weight_unit: "KG",
      owner_name: "",
      owner_number: "",
      vaccination_status: false,
      medical_history_available: false,
      medical_history: "",
      time_slot: ""
    });
  };

  return (
    <div className="container mx-auto p-6 py-20 bg-gradient-to-b from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]/10 min-h-screen">

      <h1 className="text-3xl font-bold text-center text-white mb-10">
        Book Veterinary Appointment
      </h1>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-[#E2E8E5] p-8 rounded-xl shadow-lg border border-[#C7D3CC] space-y-6"
      >

        <h2 className="text-2xl font-semibold text-center">
          Appointment Form
        </h2>

        {/* PET */}

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Pet Name"
            className="border p-3 rounded"
            value={formData.pet_name}
            onChange={(e) => setFormData({ ...formData, pet_name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Pet Type (Dog, Cow, Cat...)"
            className="border p-3 rounded"
            value={formData.pet_type}
            onChange={(e) => setFormData({ ...formData, pet_type: e.target.value })}
            required
          />

        </div>

        <div className="grid md:grid-cols-3 gap-4">

          <select
            className="border p-3 rounded"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            required
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            type="text"
            placeholder="Age"
            className="border p-3 rounded"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />

          <div className="flex gap-2">

            <input
              type="text"
              placeholder="Weight"
              className="border p-3 rounded w-full"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />

            <select
              className="border p-3 rounded"
              value={formData.weight_unit}
              onChange={(e) => setFormData({ ...formData, weight_unit: e.target.value })}
            >
              <option>KG</option>
              <option>LBS</option>
            </select>

          </div>

        </div>

        {/* OWNER */}

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Owner Name"
            className="border p-3 rounded"
            value={formData.owner_name}
            onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
            required
          />

          <input
            type="tel"
            placeholder="Owner Phone"
            className="border p-3 rounded"
            value={formData.owner_number}
            onChange={(e) => setFormData({ ...formData, owner_number: e.target.value })}
            required
          />

        </div>

        {/* TIME SLOT */}

        <select
          className="border p-3 rounded w-full"
          value={formData.time_slot}
          onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
          required
        >

          <option value="">Select Time Slot</option>

          {timeSlots.map((slot) => (
            <option key={slot}>{slot}</option>
          ))}

        </select>

        {/* CHECKBOXES */}

        <div className="bg-gray-100 p-4 rounded-lg space-y-3">

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.vaccination_status}
              onChange={(e) => setFormData({ ...formData, vaccination_status: e.target.checked })}
            />
            Pet is Vaccinated
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.medical_history_available}
              onChange={(e) => setFormData({ ...formData, medical_history_available: e.target.checked })}
            />
            Medical History Available
          </label>

        </div>

        {/* MEDICAL HISTORY */}

        {formData.medical_history_available && (

          <div className="space-y-3">
            <p className="text-sm font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              ⚠️ Please bring the medical History
            </p>
            <textarea
              placeholder="want say something write here"
              className="border p-3 rounded w-full"
              rows="4"
              value={formData.medical_history}
              onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
            />
          </div>

        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          Book Appointment
        </button>

      </form>

      {/* SUCCESS POPUP */}

      {showPopup && (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">

          <div className="bg-white p-8 rounded-xl shadow-lg text-center w-80">

            <h2 className="text-2xl font-bold text-green-600 mb-3">
              ✅ Success
            </h2>

            <p className="text-gray-600 mb-6">
              Appointment Booked Successfully!
            </p>

            <button
              onClick={() => setShowPopup(false)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              OK
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default AppointmentsPage;