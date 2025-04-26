import { useState } from 'react';
import axiosClient from '../../axios-client';
import { useNavigate } from 'react-router-dom';

export default function AddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student'
  });
  const [errors, setErrors] = useState({});

  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        <input name="name" onChange={onChange} />
        {errors.name && <p>{errors.name[0]}</p>}

        <label>Email:</label>
        <input name="email" onChange={onChange} />
        {errors.email && <p>{errors.email[0]}</p>}

        <label>Password:</label>
        <input type="password" name="password" onChange={onChange} />
        {errors.password && <p>{errors.password[0]}</p>}

        <label>Role:</label>
        <select name="role" onChange={onChange} value={form.role}>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        {errors.role && <p>{errors.role[0]}</p>}

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
