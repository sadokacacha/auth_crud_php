// DashboardLayout.jsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";

export default function DashboardLayout() {
  const navigate = useNavigate();

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
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
