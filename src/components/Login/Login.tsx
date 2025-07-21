import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userExists, findUserByEmailOrPhone } from '../../utils/authStore'; // Import functions from authStore
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', phone: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/home');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear any existing error when user starts typing again
    if (error) setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.phone || formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    // Check if user exists in the authStore and verify credentials match
    const userByEmail = findUserByEmailOrPhone(formData.email);
    const userByPhone = findUserByEmailOrPhone(formData.phone);

    if (!userByEmail && !userByPhone) {
      setError('No account found with this email or phone. Please sign up first.');
      return;
    }

    // If we found a user by email but the phone doesn't match
    if (userByEmail && userByEmail.phone !== formData.phone) {
      setError('The phone number does not match our records for this email.');
      return;
    }

    // If we found a user by phone but the email doesn't match
    if (userByPhone && userByPhone.email !== formData.email) {
      setError('The email does not match our records for this phone number.');
      return;
    }

    // Get user details - at this point we know they match
    const user = userByEmail && userByPhone;
    const userFullName = user?.fullName || 'User';

    // Generate OTP
    const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
    const generatedOtp = generateOtp();

    console.log('Login OTP (Dev):', generatedOtp);
    alert(`Sending OTP to +91 ${formData.phone} and ${userFullName}`);

    // Navigate with state, including user's fullName
    navigate('/login-otp', {
      state: {
        email: formData.email,
        phone: formData.phone,
        fullName: userFullName, // Pass the user's name to the OTP page
        flow: 'login',
        otp: generatedOtp,
      },
    });
  };

  const handleSignUp = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <div className="login-containered">
      <button className="back-button-fixed" onClick={handleBack} aria-label="Go back to home page">
        ←
      </button>

      <div className="login-content">
        <div className="medical-background" />
        <div className="login-header">
          <h1 className="login-title">OTP Verification</h1>
          <p className="login-subtitle">Enter email and phone number to send OTP</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {error && <div className="error-message login-error">{error}</div>}
          
          <div className="input-wrapper">
            <label className="input-label" htmlFor="email">Email Id</label>
            <input
              type="email"
              id="email"
              name="email"
              className="styled-input"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-wrapper">
            <label className="input-label" htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="styled-input"
              placeholder="Enter 10-digit number"
              value={formData.phone}
              onChange={handleInputChange}
              maxLength={10}
              pattern="[0-9]{10}"
              required
              autoComplete="tel"
              inputMode="numeric"
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={formData.phone.length !== 10 || !formData.email}
          >
            Send OTP
          </button>
        </form>

        <div className="login-footer">
          Don't have an account?{' '}
          <a href="#" onClick={handleSignUp} role="button" tabIndex={0}>
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
