import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./contexts/ProtectedRoute";

import Login from "./views/Login";

import DashboardLayout from "./components/DashboardLayout";
import  AdminDashboard from "./views/admin/AdminDashboard";
import TeacherDashboard from "./views/teacher/TeacherDashboard";
import StudentDashboard from "./views/student/StudentDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        {/* Other admin routes here */}
      </Route>

      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<TeacherDashboard />} />
        {/* Other teacher routes here */}
      </Route>

      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        {/* Other student routes here */}
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
