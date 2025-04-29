import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

import axiosClient from '../../axios-client';
import { Link } from 'react-router-dom';
import './UserManagement.css'; 

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredRole, setFilteredRole] = useState('admin'); // default to admin
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get('/users')
      .then(({ data }) => setUsers(data))
      .catch(console.error);
  }, []);

  // Filter users based on selected role
  const filteredUsers = users.filter(u => u.role === filteredRole);

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h2>User Management</h2>
        <Link to="/admin/users/new" className="add-user-btn">+ Add New User</Link>
      </div>

      {/* Buttons to switch between user roles */}
      <div className="role-filter-buttons">
        <button onClick={() => setFilteredRole('admin')}>Admins</button>
        <button onClick={() => setFilteredRole('teacher')}>Teachers</button>
        <button onClick={() => setFilteredRole('student')}>Students</button>
      </div>

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
 <tbody>
            {filteredUsers.map(u => (
              <tr 
                key={u.id} 
                className="clickable-row" 
                onClick={() => navigate(`/admin/users/${u.id}`)}
              >
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className="role-cell">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
