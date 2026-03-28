import AdminSidebar from "./AdminSidebar";

export default function AdminDoctors() {
  return (
    <div className="flex">
      <AdminSidebar />

      <div className="p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">Doctors</h1>

        <div className="bg-teal-50 p-6 rounded shadow">
          Doctor Management Panel
        </div>
      </div>
    </div>
  );
}