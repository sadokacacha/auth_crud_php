import { useEffect, useState } from 'react';
import axiosClient from '../../axios-client';
import './SchoolSchedule.css';

export default function SchoolSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');

  useEffect(() => {
    axiosClient.get('/schedules').then(({ data }) => setSchedule(data));
    axiosClient.get('/classrooms').then(({ data }) => setClassrooms(data));
  }, []);

  const filteredSchedule = selectedClassroom
    ? schedule.filter(s => s.classroom_id === selectedClassroom)
    : schedule;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`);

  return (
    <div className="school-schedule">
      <h2>📅 Weekly School Schedule</h2>

      <div className="filter-container">
        <label>Filter by Classroom:</label>
        <select onChange={e => setSelectedClassroom(e.target.value)} value={selectedClassroom}>
          <option value="">All</option>
          {classrooms.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="schedule-grid">
        <div className="header-row">
          <div className="cell time-cell"></div>
          {days.map(day => (
            <div className="cell" key={day}>{day}</div>
          ))}
        </div>

        {hours.map(hour => (
          <div className="row" key={hour}>
            <div className="cell time-cell">{hour}</div>
            {days.map(day => {
              const cell = filteredSchedule.find(
                s => s.day === day && s.time === hour
              );
              return (
                <div className="cell" key={`${day}-${hour}`}>
                  {cell ? (
                    <>
                      <div><strong>{cell.subject}</strong></div>
                      <div>{cell.teacher}</div>
                      <div className="classroom-label">{cell.classroom}</div>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
