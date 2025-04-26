import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const role = localStorage.getItem("USER_ROLE"); // <== THIS was missing

  const handleLogout = async () => {
    try {
      await axiosClient.post("/logout", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
        },
      });

      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("USER_ROLE");

      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div>
      <nav style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <h2>Dashboard</h2>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={`/${role}/dashboard`}>Home</Link>
          {role === 'admin' && (
            <>
              <Link to="/admin/users">Users</Link>
              <Link to="/admin/users/new">Add User</Link>
            </>
          )}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
