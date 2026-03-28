import { appointmentsPage, appointmentTimeSlots } from "@/assets/appointments";

export default function AppointmentsFormBody({ form, onFieldChange, onSubmit }) {
  const c = appointmentsPage;

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-3xl mx-auto bg-[#E2E8E5] p-8 rounded-xl shadow-lg border border-[#C7D3CC] space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center">{c.formTitle}</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder={c.placeholders.petName}
          className="border p-3 rounded"
          value={form.pet_name}
          onChange={(e) => onFieldChange("pet_name", e.target.value)}
          required
        />
        <input
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
          type="text"
          placeholder={c.placeholders.age}
          className="border p-3 rounded"
          value={form.age}
          onChange={(e) => onFieldChange("age", e.target.value)}
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={c.placeholders.weight}
            className="border p-3 rounded w-full"
            value={form.weight}
            onChange={(e) => onFieldChange("weight", e.target.value)}
          />
          <select
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
          type="text"
          placeholder={c.placeholders.ownerName}
          className="border p-3 rounded"
          value={form.owner_name}
          onChange={(e) => onFieldChange("owner_name", e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder={c.placeholders.ownerPhone}
          className="border p-3 rounded"
          value={form.owner_number}
          onChange={(e) => onFieldChange("owner_number", e.target.value)}
          required
        />
      </div>

      <select
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

      <div className="bg-gray-100 p-4 rounded-lg space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.vaccination_status}
            onChange={(e) => onFieldChange("vaccination_status", e.target.checked)}
          />
          {c.labels.vaccinated}
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.medical_history_available}
            onChange={(e) => onFieldChange("medical_history_available", e.target.checked)}
          />
          {c.labels.medicalHistoryAvailable}
        </label>
      </div>

      {form.medical_history_available && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
            {c.labels.medicalHistoryWarning}
          </p>
          <textarea
            placeholder={c.placeholders.medicalNote}
            className="border p-3 rounded w-full"
            rows={4}
            value={form.medical_history}
            onChange={(e) => onFieldChange("medical_history", e.target.value)}
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
      >
        {c.submit}
      </button>
    </form>
  );
}
