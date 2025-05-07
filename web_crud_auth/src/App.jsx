import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './contexts/ProtectedRoute';

import Login from './views/Login';
import DashboardLayout from './components/DashboardLayout';
import AdminDashboard   from './views/admin/AdminDashboard';
import TeacherDashboard from './views/teacher/TeacherDashboard';
import StudentDashboard from './views/student/StudentDashboard';
import UserManagement from './views/admin/UserManagement';
import AddUser from './views/admin/AddUser';
import ViewUser from './views/admin/ViewUser';
import TeacherSchedule from './views/admin/TeacherSchedule';
import SchoolSchedule from './views/admin/SchoolSchedule';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={
        <ProtectedRoute role="admin">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users"     element={<UserManagement/>} />
        <Route path="users/new" element={<AddUser/>} />
        <Route path="users/:id" element={<ViewUser/>} />
        <Route path="/admin/users/:id/schedule" element={<TeacherSchedule/>} />
        <Route path="/admin/school-schedule" element={<SchoolSchedule />} />




      </Route>







      <Route path="/teacher" element={
        <ProtectedRoute role="teacher">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<TeacherDashboard />} />
      </Route>

      <Route path="/student" element={
        <ProtectedRoute role="student">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<StudentDashboard />} />
      </Route>

      {/* catch-all */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
