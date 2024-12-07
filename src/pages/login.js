import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';  // Make sure the Toastr CSS is imported

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', form);
      const token = response.data.token;
      localStorage.setItem('token', token);

      toastr.success('Login successful!'); // Show success message
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error occurred'; // Extract specific error message
      toastr.error(errorMessage); // Show error message
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}
