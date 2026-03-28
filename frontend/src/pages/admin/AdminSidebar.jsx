import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed">

      <div className="p-4 text-2xl font-bold border-b">
        PashuVaani Admin
      </div>

      <nav className="flex flex-col p-4 space-y-4">

        <Link to="/admin/dashboard">Dashboard</Link>

        <Link to="/admin/users">Users</Link>

        <Link to="/admin/doctors">Doctors</Link>

        <Link to="/admin/appointments">Appointments</Link>

        <Link to="/admin/blogs">Blogs</Link>

      </nav>

    </div>
  );
}