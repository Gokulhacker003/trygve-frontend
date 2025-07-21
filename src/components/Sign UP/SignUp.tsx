import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
  const [phone, setPhone] = useState('');
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
    }
  };

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phone.length !== 10) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }
    
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Signup OTP:', generatedOtp);

    // Store OTP session details in local storage as a JSON string
    const otpSession = {
        phone: phone,
        otp: generatedOtp,
        source: 'signup',
        timestamp: new Date().getTime() // Add a timestamp for expiration
    };
    localStorage.setItem('otp_session', JSON.stringify(otpSession));
    
    alert(`Sending OTP to +91 ${phone}... (Check console for OTP)`);
    
    // Navigate without state
    navigate('/signup-otp');
  };

  return (
    <div className="signup-bg">
      <button className="signup-back" onClick={handleBack}>
        ←
      </button>

      <div className="signup-content">
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

          <button type="submit" className="signup-button" disabled={phone.length !== 10}>
            Send Code
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
