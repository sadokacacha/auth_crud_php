import { useEffect, useState } from 'react';
import axiosClient from '../../axios-client';
import './Attendance.css'; // optional styling

export default function Attendance() {
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // track status per schedule id: 'present' | 'absent'
  const [attendanceStatus, setAttendanceStatus] = useState({});

  useEffect(() => {
    axiosClient
      .get('/emploi/today')
      .then(({ data }) => {
        setTodaySchedule(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Failed to load today’s schedule', err);
        setError('Could not load today’s schedule.');
      })
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) return <p>Loading today’s schedule…</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="attendance-page">
      <h2>🗓️ Today’s Teaching Schedule</h2>
      {todaySchedule.length === 0 && <p>No classes scheduled today.</p>}

      {todaySchedule.map((s) => (
        <div key={s.id} className="attendance-card">
          <div>
            <strong>{s.teacher.user.name}</strong> — {s.subject.name} in {s.classroom.name}
          </div>
          <div>
            {s.start_time} &ndash; {s.end_time}
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
