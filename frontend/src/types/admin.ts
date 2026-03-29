export type AdminAppointmentRow = {
  id: string | number;
  pet_name: string;
  owner_name: string;
  status: string;
};

export function isAdminAppointmentRow(v: unknown): v is AdminAppointmentRow {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    (typeof o.id === "string" || typeof o.id === "number") &&
    typeof o.pet_name === "string" &&
    typeof o.owner_name === "string" &&
    typeof o.status === "string"
  );
}
