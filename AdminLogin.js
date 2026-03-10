import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(formData.email, formData.password);
      if (data.success) {
        if (data.user.role !== 'admin') {
          toast.error('Access denied. Admin credentials required.');
          return;
        }
        toast.success('Welcome, Admin!');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg">
        <div className="admin-bg-pattern"></div>
      </div>

      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-icon">🏨</div>
          <div className="auth-header">
            <h1 className="auth-title">Admin Portal</h1>
            <p className="auth-subtitle">Secure access for hotel administrators</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="admin@grandeur.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" placeholder="Enter admin password" required />
            </div>
            <button type="submit" className="btn-auth btn-admin" disabled={loading}>
              {loading ? <span className="btn-spinner"></span> : 'Access Dashboard'}
            </button>
          </form>

          <div className="auth-hint">
            <p>Demo Admin: <strong>admin@grandeur.com</strong> / <strong>admin123</strong></p>
          </div>

          <div className="auth-footer">
            <p><Link to="/">← Back to Website</Link></p>
            <p>Guest? <Link to="/login">User Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;