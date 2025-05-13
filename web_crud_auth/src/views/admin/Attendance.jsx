import { useEffect, useState } from 'react';
import axiosClient             from '../../axios-client';
import './Attendance.css';

export default function Attendance({ range = 'today' }) {
  const [schedule, setSchedule]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [attendanceStatus, setStatus] = useState({});

  useEffect(() => {
    setLoading(true);
    setError(null);

    const endpoint =
      range === 'today'      ? '/emploi/today' :
      range === 'week'       ? '/emploi/week' :
                               '/emploi/next-week';

    axiosClient.get(endpoint)
      .then(({ data }) => {
        setSchedule(Array.isArray(data) ? data : data.schedules);
      })
      .catch(() => {
        setError('Could not load schedule.');
      })
      .finally(() => setLoading(false));
  }, [range]);

  const mark = (schedule_id, status, teacher_id) => {
    axiosClient.post('/attendance/mark', {
      schedule_id,
      teacher_id,
      date:   new Date().toISOString().slice(0,10),
      status,
      hours:  status === 'present' ? 1 : 0,
    })
    .then(() => {
      setStatus(s => ({ ...s, [schedule_id]: status }));
    })
    .catch(() => alert('Failed to mark attendance.'));
  };

  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{ color:'red' }}>{error}</p>;

  return (
    <table className="attendance-table">
      <thead>
        <tr>
          <th>Teacher</th><th>Class</th><th>Date</th>
          <th>Time</th><th>Status</th><th>Mark</th>
        </tr>
      </thead>
      <tbody>
        {schedule.map(s => (
          <tr key={s.id}>
            <td>{s.teacher.user.name}</td>
            <td>{s.classroom.name}</td>
            <td>{s.date}</td>
            <td>{s.start_time}–{s.end_time}</td>
            <td>
              <span className={
                attendanceStatus[s.id] === 'present' ? 'status present'
                : attendanceStatus[s.id] === 'absent'  ? 'status absent'
                : 'status none'
              }>
                {attendanceStatus[s.id]?.toUpperCase() || 'Not marked'}
              </span>
            </td>
            <td>
              <button
                disabled={attendanceStatus[s.id] === 'present'}
                onClick={() => mark(s.id, 'present', s.teacher.id)}
              >✅</button>
              <button
                disabled={attendanceStatus[s.id] === 'absent'}
                onClick={() => mark(s.id, 'absent',  s.teacher.id)}
              >❌</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}