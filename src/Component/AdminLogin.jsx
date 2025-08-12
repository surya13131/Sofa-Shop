import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import BOTTOM_IMG from '../assets/LOGO.jpg';

const AdminLogin = ({ onBack, onLoginSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'changePassword'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const resetState = () => {
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetState();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    try {
      const res = await fetch('http://localhost:8080/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Invalid admin credentials');

      const adminData = await res.json();
      localStorage.setItem('loggedInAdmin', JSON.stringify(adminData));
      if (onLoginSuccess) onLoginSuccess(adminData);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetState();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const adminEmail = e.target.adminEmail.value.trim();
    const adminPassword = e.target.adminPassword.value.trim();

    try {
      const res = await fetch('http://localhost:8080/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, adminEmail, adminPassword }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Admin already exists or invalid input');
      }

      alert('New admin created successfully.');
      setMode('login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    resetState();

    const email = e.target.email.value.trim();
    const currentPassword = e.target.currentPassword.value.trim();
    const newPassword = e.target.newPassword.value.trim();

    try {
      const res = await fetch('http://localhost:8080/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to change password');
      }

      alert('Password changed successfully.');
      setMode('login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-modal-backdrop">
      <div className="login-modal-container shadow-lg position-relative">
        <Link to="/">
                <button
                  className="btn btn-sm btn-light position-absolute top-0 start-0 m-2"
                  onClick={onBack}
                >
                  ← Back
                </button>
              </Link>

        <div className="row g-0">
          {/* Left Section */}
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-center bg-light p-4">
            <img src={BOTTOM_IMG} alt="logo" style={{ width: '80px', marginBottom: '1rem' }} />
            <h5 className="fw-bold">Admin Panel</h5>
            <p className="text-muted px-4">
              Login or manage your admin account for the store.
            </p>
          </div>

          {/* Right Form Section */}
          <div className="col-md-6 p-4">
            <h4 className="mb-3">
              {mode === 'login'
                ? 'Admin Login'
                : mode === 'register'
                ? 'Create New Admin'
                : 'Change Password'}
            </h4>

            {error && <div className="alert alert-danger py-1 small">{error}</div>}

            {/* Login Form */}
            {mode === 'login' && (
              <form onSubmit={handleLogin}>
                <input
                  name="email"
                  type="email"
                  placeholder="Admin Email"
                  className="form-control mb-3"
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="form-control mb-3"
                  required
                />
                <button type="submit" className="btn btn-danger w-100 mb-2">
                  Login as Admin
                </button>
              </form>
            )}

            {/* Register Form */}
            {mode === 'register' && (
              <form onSubmit={handleRegister}>
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  className="form-control mb-3"
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="New Admin Email"
                  className="form-control mb-3"
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="New Admin Password"
                  className="form-control mb-3"
                  required
                />
                <hr />
                <p><strong>Existing Admin Verification</strong></p>
                <input
                  name="adminEmail"
                  type="email"
                  placeholder="Your Admin Email"
                  className="form-control mb-3"
                  required
                />
                <input
                  name="adminPassword"
                  type="password"
                  placeholder="Your Admin Password"
                  className="form-control mb-3"
                  required
                />
                <button type="submit" className="btn btn-primary w-100 mb-2">
                  Create Admin
                </button>
              </form>
            )}

            {/* Change Password Form */}
            {mode === 'changePassword' && (
              <form onSubmit={handleChangePassword}>
                <input
                  name="email"
                  type="email"
                  placeholder="Admin Email"
                  className="form-control mb-3"
                  required
                />
                <input
                  name="currentPassword"
                  type="password"
                  placeholder="Current Password"
                  className="form-control mb-3"
                  required
                />
                <input
                  name="newPassword"
                  type="password"
                  placeholder="New Password"
                  className="form-control mb-3"
                  required
                />
                <button type="submit" className="btn btn-warning w-100 mb-2">
                  Change Password
                </button>
              </form>
            )}

            {/* Toggle Options */}
            <div className="text-center mt-3">
              {mode !== 'login' && (
                <button
                  className="btn btn-link p-0 me-3"
                  onClick={() => setMode('login')}
                >
                  ← Back to Login
                </button>
              )}
              {mode === 'login' && (
                <>
                  <button
                    className="btn btn-link p-0 me-3"
                    onClick={() => setMode('register')}
                  >
                    ➕ Create Admin
                  </button>
                  <button
                    className="btn btn-link p-0"
                    onClick={() => setMode('changePassword')}
                  >
                    🔒 Change Password
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
