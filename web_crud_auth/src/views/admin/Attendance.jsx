import { useEffect, useState } from 'react';
import axiosClient from '../../axios-client';
import './Attendance.css'; // optional styling

export default function Attendance({ range = 'today' }) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState({});

  useEffect(() => {
    setLoading(true);
    setError(null);
    axiosClient
      .get(`/emploi/${range}`)
      .then(({ data }) => {
        setSchedule(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Failed to load schedule', err);
        setError('Could not load schedule.');
      })
      .finally(() => setLoading(false));
  }, [range]);

  const handleMark = (schedId, status) => {
    axiosClient
      .post('/attendance', {
        schedule_id: schedId,
        date: new Date().toISOString().slice(0, 10),
        status,
      })
      .then(() => {
        setAttendanceStatus((prev) => ({
          ...prev,
          [schedId]: status,
        }));
      })
      .catch((err) => {
        console.error('Mark attendance failed', err);
        alert('Failed to mark attendance.');
      });
  };

  if (loading) return <p>Loading schedule…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="attendance-page">
      <h2>🗓️ Teaching Schedule ({range.replace('_', ' ')})</h2>
      {schedule.length === 0 && <p>No classes found.</p>}

      {schedule.map((s) => (
        <div key={s.id} className="attendance-card">
          <div>
            <strong>{s.teacher.user.name}</strong> — {s.subject.name} in {s.classroom.name}
          </div>
          <div>
            {s.date} — {s.start_time} &ndash; {s.end_time}
          </div>
          <div>
            <em>Status:</em>{' '}
            <strong>
              {attendanceStatus[s.id]
                ? attendanceStatus[s.id].toUpperCase()
                : 'Not marked'}
            </strong>
          </div>
          <button
            onClick={() => handleMark(s.id, 'present')}
            disabled={attendanceStatus[s.id] === 'present'}
          >
            ✅ Present
          </button>
          <button
            onClick={() => handleMark(s.id, 'absent')}
            disabled={attendanceStatus[s.id] === 'absent'}
          >
            ❌ Absent
          </button>
        </div>
      ))}
    </div>
  );
}
