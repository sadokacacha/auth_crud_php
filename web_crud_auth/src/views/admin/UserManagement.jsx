import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../axios-client';
import './UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredRole, setFilteredRole] = useState('admin');
  const [activePaymentUserId, setActivePaymentUserId] = useState(null);
  const [payments, setPayments] = useState({});
  const [newAmount, setNewAmount] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get('/users')
      .then(({ data }) => setUsers(data))
      .catch(console.error);
  }, []);

  const fetchPayments = (userId) => {
    axiosClient.get(`/students/${userId}/payments`).then(({ data }) => {
      setPayments(prev => ({ ...prev, [userId]: data }));
    });
  };

  const handlePaymentClick = (userId) => {
    const alreadyOpen = activePaymentUserId === userId;
    setActivePaymentUserId(alreadyOpen ? null : userId);
    if (!alreadyOpen) fetchPayments(userId);
  };

  const addPayment = (userId) => {
    if (!newAmount) return;
    axiosClient.post(`/students/${userId}/payments`, { amount: newAmount })
      .then(() => {
        fetchPayments(userId);
        setNewAmount('');
      });
  };

  const filteredUsers = users.filter(u => u.role === filteredRole);

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h2>User Management</h2>
        <div>
          <Link to="/admin/users/new" className="add-user-btn">+ Add New User</Link>
          <Link to="/admin/schedule" className="btn-schedule">📅 View Full Schedule</Link>
          <Link to="/admin/attendance" className="btn-attendance">🗓️ View Attendance</Link>
        </div>
      </div>

      <div className="role-filter-buttons">
        <button onClick={() => setFilteredRole('admin')}>Admins</button>
        <button onClick={() => setFilteredRole('teacher')}>Teachers</button>
        <button onClick={() => setFilteredRole('student')}>Students</button>
      </div>

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th>
              {(filteredRole === 'teacher' || filteredRole === 'student') && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <>
                <tr key={u.id}
                    className="clickable-row"
                    onClick={() => navigate(`/admin/users/${u.id}`)}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td className="role-cell">{u.role}</td>
                  {filteredRole === 'teacher' && (
                    <td>
                      <Link to={`/admin/users/${u.id}/schedule`} className="btn-schedule" onClick={e => e.stopPropagation()}>
                        📆 View Schedule
                      </Link>
                    </td>
                  )}
                  {filteredRole === 'student' && (
                    <td>
                      <button
                        className="btn-payment"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePaymentClick(u.id);
                        }}
                      >
                        💳 Manage Payment
                      </button>
                    </td>
                  )}
                </tr>

                {/* Inline Payment Management */}
                {filteredRole === 'student' && activePaymentUserId === u.id && (
                  <tr className="payment-row">
                    <td colSpan="4">
                      <div className="payment-box">
                        <h4>Payments for {u.name}</h4>
                        <ul>
                          {(payments[u.id] || []).map(p => (
                            <li key={p.id}>💰 ${p.amount} — {new Date(p.date).toLocaleDateString()}</li>
                          ))}
                        </ul>
                        <div className="payment-form">
                          <input
                            type="number"
                            value={newAmount}
                            onChange={(e) => setNewAmount(e.target.value)}
                            placeholder="Enter amount"
                          />
                          <button onClick={() => addPayment(u.id)}>Add Payment</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
