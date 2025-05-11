import { useEffect, useState, Fragment } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../axios-client';
import Attendance from './Attendance';
import './UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredRole, setFilteredRole] = useState('admin');
  const [activePaymentUserId, setActivePaymentUserId] = useState(null);
  const [payments, setPayments] = useState({});
  const [newAmount, setNewAmount] = useState('');
  const [scheduleTab, setScheduleTab] = useState('today');
  const [teachingSchedule, setTeachingSchedule] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get('/users')
      .then(({ data }) => setUsers(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (filteredRole === 'teacher') {
      fetchSchedule(scheduleTab);
    }
  }, [filteredRole, scheduleTab]);

  const fetchSchedule = (period) => {
    axiosClient.get(`/teachers/schedule?period=${period}`)
      .then(({ data }) => setTeachingSchedule(data))
      .catch(console.error);
  };

  const fetchPayments = (userId) => {
    axiosClient.get(`/students/${userId}/payments`)
      .then(({ data }) => {
        setPayments(prev => ({ ...prev, [userId]: data }));
      })
      .catch(console.error);
  };

  const togglePaymentBox = (userId) => {
    const isSame = activePaymentUserId === userId;
    setActivePaymentUserId(isSame ? null : userId);
    if (!isSame) fetchPayments(userId);
  };

  const handleAddPayment = (userId) => {
    if (!newAmount) return;
    axiosClient.post(`/students/${userId}/payments`, { amount: newAmount })
      .then(() => {
        fetchPayments(userId);
        setNewAmount('');
      })
      .catch(console.error);
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
        {['admin','teacher','student'].map(role => (
          <button
            key={role}
            className={filteredRole === role ? 'active' : ''}
            onClick={() => setFilteredRole(role)}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}s
          </button>
        ))}
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
            {filteredUsers.map(user => (
              <Fragment key={user.id}>
                <tr
                  className="clickable-row"
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className="role-cell">{user.role}</td>
                  {filteredRole === 'teacher' && (
                    <td>
                      <Link
                        to={`/admin/users/${user.id}/schedule`}
                        className="btn-schedule"
                        onClick={e => e.stopPropagation()}
                      >
                        📆 View Schedule
                      </Link>
                    </td>
                  )}
                  {filteredRole === 'student' && (
                    <td>
                      <button
                        className="btn-payment"
                        onClick={e => {
                          e.stopPropagation();
                          togglePaymentBox(user.id);
                        }}
                      >
                        💳 Manage Payment
                      </button>
                    </td>
                  )}
                </tr>

                {filteredRole === 'student' && activePaymentUserId === user.id && (
                  <tr className="payment-row" key={`payment-${user.id}`}>
                    <td colSpan="4">
                      <div className="payment-box">
                        <h4>Payments for {user.name}</h4>
                        <ul>
                          {(payments[user.id] || []).map(p => (
                            <li key={p.id}>
                              💰 ${p.amount} — {new Date(p.date).toLocaleDateString()}
                            </li>
                          ))}
                        </ul>
                        <div className="payment-form">
                          <input
                            type="number"
                            placeholder="Enter amount"
                            value={newAmount}
                            onChange={e => setNewAmount(e.target.value)}
                          />
                          <button onClick={() => handleAddPayment(user.id)}>Add Payment</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRole === 'teacher' && (
        <>
          <div className="embedded-attendance-section">
            <h3>📋 Attendance for Today</h3>
            <Attendance />
          </div>

          <div className="schedule-tabs">
            <h3>👩‍🏫 Who Teaches When?</h3>
            <div className="tabs">
              {[
                { key: 'today', label: 'Today' },
                { key: 'this_week', label: 'This Week' },
                { key: 'next_week', label: 'Next Week' }
              ].map(tab => (
                <button
                  key={tab.key}
                  className={scheduleTab === tab.key ? 'active' : ''}
                  onClick={() => setScheduleTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="schedule-list">
              {teachingSchedule.length === 0
                ? <p>No classes found for this period.</p>
                : <ul>
                    {teachingSchedule.map((entry, idx) => (
                      <li key={entry.id ?? idx}>
                        <strong>{entry.teacher_name}</strong> —{' '}
                        {entry.classroom.name} — {entry.date} at {entry.start_time}
                      </li>
                    ))}
                  </ul>
              }
            </div>
          </div>
        </>
      )}
    </div>
  );
}
