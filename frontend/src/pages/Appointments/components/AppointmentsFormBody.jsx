import { appointmentsPage, appointmentTimeSlots } from "@/assets/content/appointments";

export default function AppointmentsFormBody({ form, onFieldChange, onSubmit }) {
  const c = appointmentsPage;

  return (
    <form
      id="appointments-booking-form"
      onSubmit={onSubmit}
      className="max-w-3xl mx-auto bg-[#E2E8E5] p-8 rounded-xl shadow-lg border border-[#C7D3CC] space-y-6"
    >
      <h2 id="appointments-form-title" className="text-2xl font-semibold text-center">
        {c.formTitle}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          id="appointments-field-pet_name"
          type="text"
          placeholder={c.placeholders.petName}
          className="border p-3 rounded"
          value={form.pet_name}
          onChange={(e) => onFieldChange("pet_name", e.target.value)}
          required
        />
        <input
          id="appointments-field-pet_type"
          type="text"
          placeholder={c.placeholders.petType}
          className="border p-3 rounded"
          value={form.pet_type}
          onChange={(e) => onFieldChange("pet_type", e.target.value)}
          required
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <select
          id="appointments-field-gender"
          className="border p-3 rounded"
          value={form.gender}
          onChange={(e) => onFieldChange("gender", e.target.value)}
          required
        >
          {c.genderOptions.map((o) => (
            <option key={o.value || "empty"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <input
          id="appointments-field-age"
          type="text"
          placeholder={c.placeholders.age}
          className="border p-3 rounded"
          value={form.age}
          onChange={(e) => onFieldChange("age", e.target.value)}
        />
        <div className="flex gap-2">
          <input
            id="appointments-field-weight"
            type="text"
            placeholder={c.placeholders.weight}
            className="border p-3 rounded w-full"
            value={form.weight}
            onChange={(e) => onFieldChange("weight", e.target.value)}
          />
          <select
            id="appointments-field-weight_unit"
            className="border p-3 rounded"
            value={form.weight_unit}
            onChange={(e) => onFieldChange("weight_unit", e.target.value)}
          >
            {c.weightUnits.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          id="appointments-field-owner_name"
          type="text"
          placeholder={c.placeholders.ownerName}
          className="border p-3 rounded"
          value={form.owner_name}
          onChange={(e) => onFieldChange("owner_name", e.target.value)}
          required
        />
        <input
          id="appointments-field-owner_number"
          type="tel"
          placeholder={c.placeholders.ownerPhone}
          className="border p-3 rounded"
          value={form.owner_number}
          onChange={(e) => onFieldChange("owner_number", e.target.value)}
          required
        />
      </div>

      <select
        id="appointments-field-time_slot"
        className="border p-3 rounded w-full"
        value={form.time_slot}
        onChange={(e) => onFieldChange("time_slot", e.target.value)}
        required
      >
        <option value="">{c.placeholders.timeSlot}</option>
        {appointmentTimeSlots.map((slot) => (
          <option key={slot}>{slot}</option>
        ))}
      </select>

      <div id="appointments-checkboxes" className="bg-gray-100 p-4 rounded-lg space-y-3">
        <label className="flex items-center gap-2" htmlFor="appointments-field-vaccination_status">
          <input
            id="appointments-field-vaccination_status"
            type="checkbox"
            checked={form.vaccination_status}
            onChange={(e) => onFieldChange("vaccination_status", e.target.checked)}
          />
          {c.labels.vaccinated}
        </label>
        <label className="flex items-center gap-2" htmlFor="appointments-field-medical_history_available">
          <input
            id="appointments-field-medical_history_available"
            type="checkbox"
            checked={form.medical_history_available}
            onChange={(e) => onFieldChange("medical_history_available", e.target.checked)}
          />
          {c.labels.medicalHistoryAvailable}
        </label>
      </div>

      {form.medical_history_available && (
        <div id="appointments-medical-history-block" className="space-y-3">
          <p className="text-sm font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
            {c.labels.medicalHistoryWarning}
          </p>
          <textarea
            id="appointments-field-medical_history"
            placeholder={c.placeholders.medicalNote}
            className="border p-3 rounded w-full"
            rows={4}
            value={form.medical_history}
            onChange={(e) => onFieldChange("medical_history", e.target.value)}
          />
        </div>
      )}

      <button
        id="appointments-submit"
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
      >
        {c.submit}
      </button>
    </form>
  );
}
