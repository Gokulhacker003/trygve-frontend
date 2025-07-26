import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupRecaptcha, sendOtp, cleanupRecaptcha } from '../../services/firebase/auth';
import { findUserByEmailOrPhone } from '../../utils/authStore';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', phone: '' });
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  // Set up the reCAPTCHA verifier when the component mounts
  useEffect(() => {
    // Clean up on mount and unmount
    cleanupRecaptcha();
    return () => cleanupRecaptcha();
  }, []);

  const handleBack = () => navigate('/home');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValue = name === 'phone' ? value.replace(/\D/g, '') : value;
    
    if (name === 'phone' && updatedValue.length > 10) return;

    setFormData(prev => ({ ...prev, [name]: updatedValue }));
    if (error) setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // --- Step 1: Standard Form Validation ---
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    // --- Step 2: Check if user exists and credentials match ---
    const userByEmail = findUserByEmailOrPhone(formData.email);
    const userByPhone = findUserByEmailOrPhone(formData.phone);

    if (!userByEmail || !userByPhone || userByEmail.phone !== formData.phone) {
      setError('The email or phone number does not match our records.');
      return;
    }

    setIsSending(true);
    
    // --- Step 3: Firebase Phone Authentication ---
    try {
      const userFullName = userByEmail.fullName || 'User';
      const recaptchaVerifier = setupRecaptcha('recaptcha-container');
      if (!recaptchaVerifier) throw new Error("Failed to set up reCAPTCHA");
      
      const fullPhoneNumber = `+91${formData.phone}`;
      await sendOtp(fullPhoneNumber, recaptchaVerifier);
      
      navigate('/otp-verify', {
        state: {
          flow: 'login',
          phone: formData.phone,
          email: formData.email,
          fullName: userFullName,
        },
      });

    } catch (error) {
      console.error("Firebase OTP Error:", error);
      setError("Failed to send OTP. Please try again later.");
    } finally {
      setIsSending(false);
    }
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
        {/* This empty div is required for Firebase's invisible reCAPTCHA */}
        <div id="recaptcha-container"></div>

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
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isSending || formData.phone.length !== 10 || !formData.email}
          >
            {isSending ? 'Sending...' : 'Send OTP'}
          </button>
        </form>

        <div className="login-footer">
          Don't have an account?{' '}
          <a href="#" onClick={handleSignUp}>Sign up</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
