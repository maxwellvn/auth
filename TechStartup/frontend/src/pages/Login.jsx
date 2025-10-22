import { useState } from 'react';
import { authAPI } from '../services/api';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    contact: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(
        formData.email,
        formData.name,
        formData.contact
      );

      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.user));
        onLoginSuccess(response.user);
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err) {
      setError('Failed to connect to server. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Angel Court Lounge</h1>
        <p className="subtitle">Schedule Your Visit</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Number</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Please wait...' : 'Continue'}
          </button>
        </form>

        <p className="info-text">
          Enter your details to access the lounge booking system
        </p>
      </div>
    </div>
  );
}

export default Login;
