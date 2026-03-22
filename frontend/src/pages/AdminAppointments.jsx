import AdminSidebar from "./AdminSidebar";

export default function AdminAppointments() {
  return (
    <div className="flex">
      <AdminSidebar />

      <div className="p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">Appointments</h1>

        <div className="bg-white p-6 rounded shadow">
          Appointment Management Panel
        </div>
      </div>
    </div>
  );
}