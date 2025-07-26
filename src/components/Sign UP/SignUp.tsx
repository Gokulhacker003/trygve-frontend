import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { setupRecaptcha, sendOtp, cleanupRecaptcha } from '../../services/firebase/auth';
import { checkUserExists } from '../../utils/authStore'; // Import the checkUserExists function
import './SignUp.css';

function SignUp() {
  const [phone, setPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [phoneExistsError, setPhoneExistsError] = useState('');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhone(value);
      setPhoneExistsError(''); // Clear the error when the user types
    }
  };

  useEffect(() => {
    // Set up reCAPTCHA
    setupRecaptcha('recaptcha-container');

    // Clean up reCAPTCHA on unmount
    return () => {
      cleanupRecaptcha();
    };
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    // Check if the phone number already exists
    if (checkUserExists(phone)) {
      setPhoneExistsError('This phone number is already registered. Please log in.');
      return; // Do not send the OTP
    } else {
      setPhoneExistsError(''); // Clear the error if it doesn't exist
    }

    setIsSending(true);

    try {
      const fullPhoneNumber = `+91${phone}`;
      if (window.recaptchaVerifier) {
        await sendOtp(fullPhoneNumber, window.recaptchaVerifier);
      } else {
        console.error("RecaptchaVerifier is not initialized.");
        alert("Failed to send OTP. Please refresh the page and try again.");
      }

      alert(`Sending OTP to +91 ${phone}...`);

      navigate('/otp-verify', {
        state: {
          flow: 'signup',
          phone: phone,
        }
      });

    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="signup-bg">
      <button className="signup-back" onClick={handleBack}>
        ←
      </button>

      <div className="signup-content">
        {/* This empty div is required for Firebase's invisible reCAPTCHA */}
        <div id="recaptcha-container"></div>

        <div className="signup-logo-bg" />
        <div className="signup-header">
          <h2 className="signup-title">Enter Your Phone Number</h2>
          <p className="signup-subtitle">
            A one-time code will be sent to this number for verification.
          </p>
        </div>

        <form className="signup-form" onSubmit={handleSendCode}>
          <div className="signup-input-row">
            <div className="signup-country">
              <span className="signup-flag">🇮🇳</span>
              <span className="signup-code">+91</span>
            </div>
            <input
              type="tel"
              placeholder="Enter 10-digit number"
              value={phone}
              onChange={handlePhoneChange}
              className="signup-input"
              maxLength={10}
              pattern="[0-9]{10}"
              required
              autoComplete="tel"
              inputMode="numeric"
            />
          </div>
          {phoneExistsError && <p className="error-message">{phoneExistsError}</p>} {/* Display the error message */}

          <button type="submit" className="signup-button" disabled={phone.length !== 10 || isSending || phoneExistsError !== ''}>
            {isSending ? 'Sending...' : 'Send Code'}
          </button>
        </form>

        <div className="signup-footer">
          Already have an account?{' '}
          <a href="#" onClick={handleLogin} role="button" tabIndex={0}>
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
