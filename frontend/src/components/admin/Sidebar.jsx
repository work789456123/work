import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        background: "#222",
        color: "white",
        padding: "20px",
        position: "fixed"
      }}
    >
      <h2>PashuVaani</h2>

      <p><Link to="/admin/dashboard" style={{color:"white"}}>Dashboard</Link></p>
      <p><Link to="/admin/users" style={{color:"white"}}>Users</Link></p>
      <p><Link to="/admin/doctors" style={{color:"white"}}>Doctors</Link></p>
      <p><Link to="/admin/appointments" style={{color:"white"}}>Appointments</Link></p>
      <p><Link to="/admin/blogs" style={{color:"white"}}>Blogs</Link></p>
    </div>
  );
};

export default Sidebar;