import AdminSidebar from "./AdminSidebar";

export default function AdminUsers() {
  return (
    <div className="flex">
      <AdminSidebar />

      <div className="p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">Users</h1>

        <div className="bg-white p-6 rounded shadow">
          User Management Panel
        </div>
      </div>
    </div>
  );
}