// TeacherSchedule.jsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '../../axios-client';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TeacherSchedule() {
  const { id } = useParams();
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    axiosClient.get(`/teachers/${id}/schedule`)
      .then(({ data }) => setSchedule(data))
      .catch(console.error);
  }, [id]);

  return (
    <div className="teacher-schedule">
      <h2>📅 Weekly Schedule</h2>
      {days.map((day) => (
        <div key={day}>
          <h3>{day}</h3>
          <ul>
            {schedule
              .filter(s => s.day === day)
              .map((entry, idx) => (
                <li key={idx}>
                  {entry.start} - {entry.end}: {entry.subject} in {entry.classroom}
                </li>
              ))
            }
          </ul>
        </div>
      ))}
      <Link to={`/admin/users/${id}`}>← Back to Profile</Link>
    </div>
  );
}
