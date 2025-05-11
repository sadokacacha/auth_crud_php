import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";

export default function Attendance() {
  const [todaySchedule, setTodaySchedule] = useState([]);

  useEffect(() => {
    axiosClient.get("/emploi/today").then((res) => setTodaySchedule(res.data));
  }, []);

  const handleMark = (schedule) => {
    const confirm = window.confirm(`Mark ${schedule.teacher.user.name} as present?`);
    if (!confirm) return;

    axiosClient
      .post("/attendance", {
        schedule_id: schedule.id,
        teacher_id: schedule.teacher.id,
        date: new Date().toISOString().slice(0, 10),
        status: "present",
        hours: calculateHours(schedule.start_time, schedule.end_time),
      })
      .then(() => alert("Attendance marked."))
      .catch((err) => {
        console.error(err.response?.data || err.message);
        alert("Failed to mark attendance.");
      });
  };

  const calculateHours = (start, end) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    return (eh + em / 60) - (sh + sm / 60);
  };

  return (
    <div>
      <h2>🗓️ Today's Teaching Schedule</h2>
      {todaySchedule.length === 0 && <p>No classes scheduled today.</p>}
      {todaySchedule.map((s) => (
        <div key={s.id} className="attendance-card">
          <strong>{s.teacher?.user?.name}</strong>
          <div>📚 {s.subject?.name}</div>
          <div>🏫 {s.classroom?.name}</div>
          <div>{s.start_time} - {s.end_time}</div>
          <button onClick={() => handleMark(s)}>✅ Mark Present</button>
        </div>
      ))}
    </div>
  );
}
