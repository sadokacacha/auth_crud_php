import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import "./SchoolSchedule.css";

export default function SchoolSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [filter, setFilter] = useState({
    classroomId: "",
    teacherId: "",
    subjectId: "",
  });

  const [newEntry, setNewEntry] = useState({
    classroom_id: "",
    teacher_id: "",
    subject_id: "",
    day: "Monday",
    start_time: "8:00",
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const hours = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`);

  useEffect(() => {
    axiosClient.get("/schedules").then((r) => setSchedule(r.data));
    axiosClient.get("/classrooms").then((r) => setClassrooms(r.data));
    axiosClient.get("/teachers").then((r) => setTeachers(r.data));
    axiosClient.get("/subjects").then((r) => setSubjects(r.data));
  }, []);

  const filtered = schedule.filter((s) => {
    return (!filter.classroomId || s.classroom_id === +filter.classroomId) &&
           (!filter.teacherId || s.teacher_id === +filter.teacherId) &&
           (!filter.subjectId || s.subject_id === +filter.subjectId);
  });

  const handleAdd = (e) => {
    e.preventDefault();
    axiosClient.post("/schedules", newEntry).then((res) => {
      setSchedule((prev) => [...prev, res.data]);
      setNewEntry({
        classroom_id: "",
        teacher_id: "",
        subject_id: "",
        day: "Monday",
        start_time: "8:00",
      });
    });
  };

  return (
    <div className="school-schedule">
      <h2>📅 Weekly Schedule</h2>

      <div className="filter-container">
        <select onChange={e => setFilter(f => ({ ...f, classroomId: e.target.value }))}>
          <option value="">All Rooms</option>
          {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select onChange={e => setFilter(f => ({ ...f, teacherId: e.target.value }))}>
          <option value="">All Teachers</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.user.name}</option>)}
        </select>
        <select onChange={e => setFilter(f => ({ ...f, subjectId: e.target.value }))}>
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <form className="add-schedule-form" onSubmit={handleAdd}>
        <h3>➕ Add Class to Schedule</h3>
        <select required value={newEntry.classroom_id} onChange={e => setNewEntry(n => ({ ...n, classroom_id: e.target.value }))}>
          <option value="">Select Classroom</option>
          {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select required value={newEntry.teacher_id} onChange={e => setNewEntry(n => ({ ...n, teacher_id: e.target.value }))}>
          <option value="">Select Teacher</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.user.name}</option>)}
        </select>
        <select required value={newEntry.subject_id} onChange={e => setNewEntry(n => ({ ...n, subject_id: e.target.value }))}>
          <option value="">Select Subject</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select required value={newEntry.day} onChange={e => setNewEntry(n => ({ ...n, day: e.target.value }))}>
          {days.map(day => <option key={day} value={day}>{day}</option>)}
        </select>
        <select required value={newEntry.start_time} onChange={e => setNewEntry(n => ({ ...n, start_time: e.target.value }))}>
          {hours.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
        <button type="submit">Add</button>
      </form>

      <div className="schedule-grid">
        <div className="row header">
          <div className="cell time-cell"></div>
          {days.map(day => (
            <div key={day} className="cell header-cell">{day}</div>
          ))}
        </div>

        {hours.map(hour => (
          <div className="row" key={hour}>
            <div className="cell time-cell">{hour}</div>
            {days.map(day => {
              const events = filtered.filter(s => s.day === day && s.start_time === hour);
              return (
                <div className="cell" key={day + hour}>
                  {events.map(evt => (
                    <div key={evt.id} className="event">
                      <strong>{evt.subject.name}</strong><br />
                      {evt.teacher.user.name}<br />
                      <span className="small">{evt.classroom.name}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
