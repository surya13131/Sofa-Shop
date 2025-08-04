import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import BOTTOM_IMG from '../assets/LOGO.jpg';

const LoginRegister = ({ onBack, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const toggleMode = () => {
    setError('');
    setIsRegister(!isRegister);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const name = isRegister ? e.target.fullName.value.trim() : '';
    const email = e.target.email?.value.trim() || '';
    const phone = isRegister ? e.target.phone?.value.trim() : '';
    const password = e.target.password.value.trim();
    const address = isRegister ? e.target.address.value.trim() : '';

    try {
      let res;

      if (isRegister) {
        const payload = { name, email, phone, password, address };

        res = await fetch('http://localhost:8080/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('User already exists or invalid data');

        const userData = await res.json();
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        if (onLoginSuccess) onLoginSuccess(userData);
      } else {
        const identifier = email;
        const isPhone = /^\d{10}$/.test(identifier);

        const payload = {
          password,
          [isPhone ? 'phone' : 'email']: identifier,
        };

        res = await fetch('http://localhost:8080/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.status === 401) throw new Error('Invalid credentials');

        const userData = await res.json();
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        if (onLoginSuccess) onLoginSuccess(userData);
      }

      onBack(); // Close the modal
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
          {/* Left Info Section */}
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-center bg-light p-4">
            <img src={BOTTOM_IMG} alt="logo" style={{ width: '80px', marginBottom: '1rem' }} />
            <h5 className="fw-bold">Welcome to Goodwill Lining</h5>
            <p className="text-muted px-4">
              Discover stylish and comfortable sofas for your home. Register to get exclusive offers and track your orders with ease.
            </p>
          </div>

          {/* Right Form Section */}
          <div className="col-md-6 p-4">
            <h4 className="mb-3">
              {isRegister ? 'Create an Account' : 'Login to Your Account'}
            </h4>

            {error && <div className="alert alert-danger py-1 small">{error}</div>}

            <form onSubmit={handleSubmit}>
              {isRegister && (
                <>
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Full Name"
                    className="form-control mb-3"
                    required
                  />
                  <input
                    name="phone"
                    type="text"
                    placeholder="Phone Number"
                    className="form-control mb-3"
                    pattern="\d{10}"
                    maxLength="10"
                    required
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="form-control mb-3"
                    required
                  />
                  <textarea
                    name="address"
                    placeholder="Full Address"
                    className="form-control mb-3"
                    rows="3"
                    required
                  ></textarea>
                </>
              )}

              {!isRegister && (
                <input
                  name="email"
                  type="text"
                  placeholder="Email or Phone"
                  className="form-control mb-3"
                  required
                />
              )}

              <input
                name="password"
                type="password"
                placeholder="Password"
                className="form-control mb-3"
                required
              />

              <button type="submit" className="btn btn-danger w-100 mb-2">
                {isRegister ? 'Register' : 'Login'}
              </button>

              <div className="text-center mt-2">
                <small>
                  {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={toggleMode}
                  >
                    {isRegister ? 'Login' : 'Register'}
                  </button>
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
