import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', address: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = formData;
      const result = await register(data);
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80)' }}>
        <div className="auth-overlay"></div>
      </div>

      <div className="auth-container auth-container-wide">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-brand">
              <span style={{ color: 'var(--accent)' }}>✦</span> Grandeur Palace
            </Link>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join us for exclusive benefits and seamless reservations</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-control" placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="your@email.com" required />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" placeholder="Your address (optional)" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" placeholder="Min 6 characters" required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-control" placeholder="Repeat password" required />
              </div>
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? <span className="btn-spinner"></span> : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;