import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../axios-client';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './ViewUser.css'; 

export default function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
  });

  useEffect(() => {
    axiosClient.get(`/users/${id}`)
      .then(({ data }) => {
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          address: data.address || '',
          role: data.role,
        });
      })
      .catch(console.error);
  }, [id]);

  const handleSave = () => {
    axiosClient.put(`/users/${id}`, formData)
      .then(() => {
        setUser({ ...user, ...formData });
        setEditMode(false);
      })
      .catch(err => {
        console.error(err);
        alert('Update failed');
      });
  };

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    axiosClient.delete(`/users/${id}`)
      .then(() => {
        navigate('/admin/users');
      })
      .catch(err => {
        console.error(err);
        alert('Delete failed');
      });
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="user-profile">
      <div className="user-profile-header">
        <h2>User Details</h2>
        <div className="action-buttons">
          {editMode ? (
            <>
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button className="edit-btn" onClick={() => setEditMode(true)}>Edit</button>
              <button className="delete-btn" onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      </div>

      <div className="user-profile-content">
        <div className="profile-card">
          <div className="avatar-placeholder" />

          {editMode ? (
            <>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
              />
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
              />
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone"
              />
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="Address"
              />
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </>
          ) : (
            <>
              <h3>{user.name}</h3>
              <p>{user.email}</p>

              {user.role === 'student' && (
                <>
                  <div style={{ width: 100, height: 100, margin: '1rem auto' }}>
                    <CircularProgressbar
                      value={33}
                      text={`1 of 3`}
                      styles={buildStyles({
                        textColor: '#333',
                        pathColor: '#865DFF',
                        trailColor: '#eee',
                      })}
                    />
                  </div>
                </>
              )}

              <div className="info-block">
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Address:</strong> {formData.address}</p>
                <p><strong>Role:</strong> {formData.role}</p>
              </div>
            </>
          )}
        </div>

        <div className="payment-history">
          <h3>💵 Payment History</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Apr 15, 2025</td>
                <td>$1,250</td>
                <td><span className="status pending">pending</span></td>
              </tr>
              <tr>
                <td>Mar 15, 2025</td>
                <td>$1,250</td>
                <td><span className="status completed">completed</span></td>
              </tr>
              <tr>
                <td>Feb 15, 2025</td>
                <td>$1,250</td>
                <td><span className="status completed">completed</span></td>
              </tr>
              <tr>
                <td>Jan 15, 2025</td>
                <td>$1,250</td>
                <td><span className="status completed">completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Link className="back-link" to="/admin/users">← Back to User Management</Link>
    </div>
  );
}
