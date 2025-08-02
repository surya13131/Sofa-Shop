import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import BOTTOM_IMG from '../assets/LOGO.jpg';

const LoginRegister = ({ onBack }) => {
  const [isRegister, setIsRegister] = useState(false);
  const toggleMode = () => setIsRegister(!isRegister);

  return (
    <div className="login-modal-backdrop">
      <div className="login-modal-container shadow-lg position-relative">

        <Link to="/">
          <button className="btn btn-sm btn-light position-absolute top-0 start-0 m-2" onClick={onBack}>
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
            <h4 className="mb-3">{isRegister ? 'Create an Account' : 'Login to Your Account'}</h4>
            <form>
              {isRegister && (
                <>
                  <input type="text" placeholder="Full Name" className="form-control mb-3" required />
                  <input type="tel" placeholder="Phone Number" className="form-control mb-3" required />
                  <textarea placeholder="Address" className="form-control mb-3" rows={2} required />
                </>
              )}

              <input type="email" placeholder="Email" className="form-control mb-3" required />
              <input type="password" placeholder="Password" className="form-control mb-3" required />

              <button className="btn btn-dark w-100 mb-2">
                {isRegister ? 'Register' : 'Login'}
              </button>

              <p className="text-center small">
                {isRegister ? 'Already have an account?' : 'New to Goodwill Lining?'}
                <span className="text-primary ms-1" style={{ cursor: 'pointer' }} onClick={toggleMode}>
                  {isRegister ? 'Login' : 'Register'}
                </span>
              </p>

              <p className="text-center small text-muted mt-3">
                By continuing, you agree to our Terms & Conditions and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
