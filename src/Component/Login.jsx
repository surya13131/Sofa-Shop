import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import BOTTOM_IMG from '../assets/LOGO.jpg';

const LoginRegister = ({ onBack }) => {
  const [isRegister, setIsRegister] = useState(false);

  const toggleMode = () => setIsRegister(!isRegister);

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = isRegister ? e.target.fullName.value : 'User';
    const email = e.target.email.value;
    const address = isRegister ? e.target.address.value : '';

    const userData = {
      name,
      email,
      address,
    };

    localStorage.setItem('loggedInUser', JSON.stringify(userData));
    onBack(); // Close the login modal
    window.location.reload(); // Reload to reflect login
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
            <img
              src={BOTTOM_IMG}
              alt="sofa icon"
              style={{ width: '80px', marginBottom: '1rem' }}
            />
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
                  <textarea
                    name="address"
                    placeholder="Full Address"
                    className="form-control mb-3"
                    rows="3"
                    required
                  ></textarea>
                </>
              )}
              <input
                name="email"
                type="email"
                placeholder="Email or Mobile"
                className="form-control mb-3"
                required
              />
              <input
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
