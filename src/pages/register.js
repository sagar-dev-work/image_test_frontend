import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';  // Import Toastr CSS

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (form.password !== form.password_confirmation) {
      toastr.error("Passwords do not match!");
      return;
    }

    try {
      // Send POST request to register
      await api.post('/register', form);
      toastr.success('Registration successful! You can now log in.');  // Show success message
      router.push('/login');  // Redirect to the login page after successful registration
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed.';  // Capture specific error message from API
      toastr.error(errorMessage);  // Show error message
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
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
          <div className="input-group">
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm Password"
              value={form.password_confirmation}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
        
        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}
