import { useEffect, useState } from 'react';
import axiosClient from '../../axios-client';
import { Link } from 'react-router-dom';
import './UserManagement.css'; 

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axiosClient.get('/users')
      .then(({ data }) => setUsers(data))
      .catch(console.error);
  }, []);

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h2>User Management</h2>
        <Link to="/admin/users/new" className="add-user-btn">+ Add New User</Link>
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
            {users.map(u => (
              <tr key={u.id}>
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
