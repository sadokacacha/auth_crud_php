import { useState, useEffect } from 'react';
import axiosClient from '../../axios-client';
import { useNavigate } from 'react-router-dom';

export default function AddUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    hourly_rate: '',
    payment_method: 'cash',
    subject_ids: [],
    classroom_ids: []
  });

  const [errors, setErrors] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  // Fetch subjects and classrooms
  useEffect(() => {
    axiosClient.get('/subjects').then(({ data }) => setSubjects(data));
    axiosClient.get('/classrooms').then(({ data }) => setClassrooms(data));
  }, []);

  const onChange = e => {
    const { name, value, multiple, options } = e.target;

    if (multiple) {
      const selected = [...options].filter(o => o.selected).map(o => o.value);
      setForm(prev => ({ ...prev, [name]: selected }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    setErrors({});
    try {
      await axiosClient.post('/users', form);
      navigate('/admin/users');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      }
    }
  };

  return (
    <div>
      <h2>Create User</h2>
      <form onSubmit={onSubmit}>
        <label>Name:</label>
        <input name="name" value={form.name} onChange={onChange} />
        {errors.name && <p>{errors.name[0]}</p>}

        <label>Email:</label>
        <input name="email" value={form.email} onChange={onChange} />
        {errors.email && <p>{errors.email[0]}</p>}

        <label>Password:</label>
        <input type="password" name="password" value={form.password} onChange={onChange} />
        {errors.password && <p>{errors.password[0]}</p>}

        <label>Role:</label>
        <select name="role" value={form.role} onChange={onChange}>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        {errors.role && <p>{errors.role[0]}</p>}

        {/* Show these fields only if teacher is selected */}
        {form.role === 'teacher' && (
          <>
            <label>Hourly Rate:</label>
            <input name="hourly_rate" value={form.hourly_rate} onChange={onChange} />
            {errors.hourly_rate && <p>{errors.hourly_rate[0]}</p>}

            <label>Payment Method:</label>
            <select name="payment_method" value={form.payment_method} onChange={onChange}>
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="bank">Bank</option>
            </select>
            {errors.payment_method && <p>{errors.payment_method[0]}</p>}

            <label>Subjects:</label>
            <select name="subject_ids" multiple onChange={onChange} value={form.subject_ids}>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
            {errors.subject_ids && <p>{errors.subject_ids[0]}</p>}

            <label>Classrooms:</label>
            <select name="classroom_ids" multiple onChange={onChange} value={form.classroom_ids}>
              {classrooms.map(classroom => (
                <option key={classroom.id} value={classroom.id}>{classroom.name}</option>
              ))}
            </select>
            {errors.classroom_ids && <p>{errors.classroom_ids[0]}</p>}
          </>
        )}

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
