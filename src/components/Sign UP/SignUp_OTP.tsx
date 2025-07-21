import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../common/OTP_verify.css';

function Signup_OTP_verify() {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [correctOtp, setCorrectOtp] = useState('');
  const [userDetails, setUserDetails] = useState({ phone: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const sessionData = localStorage.getItem('otp_session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      // Check if the session is for signup and not too old (e.g., 10 minutes)
      const isSessionValid = session.source === 'signup' && (new Date().getTime() - session.timestamp < 600000);

      if (isSessionValid) {
        setUserDetails({ phone: session.phone });
        setCorrectOtp(session.otp);
      } else {
        localStorage.removeItem('otp_session');
        alert('Session expired or invalid. Please try again.');
        navigate('/signup');
      }
    } else {
      alert('No session found. Please start the signup process again.');
      navigate('/signup');
    }
  }, [navigate]);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pasted.length === 6) {
      const otpArray = pasted.split('');
      setOtp(otpArray);
      inputsRef.current[5]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otp.join('');

    if (enteredCode === correctOtp) {
      alert('OTP verified successfully!');
      // Set a flag to allow access to the next page
      localStorage.setItem('auth_flow_status', 'can_create_account');
      // Clean up the OTP session
      localStorage.removeItem('otp_session');
      navigate('/create-account');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleResend = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setCorrectOtp(newOtp);
    console.log('Resent Signup OTP (Dev):', newOtp);
    alert(`New OTP sent to +91 ${userDetails.phone}`);
    setOtp(Array(6).fill(''));
    inputsRef.current[0]?.focus();
  };

  const handleBack = () => {
    navigate('/signup');
  };

  return (
    <div className="otp-containered">
      <button className="back-button-fixed" onClick={handleBack} aria-label="Back to Signup">
        ←
      </button>

      <div className="otp-content">
        <div className="otp-header">
          <h1 className="otp-title">Signup OTP Verification</h1>
          <p className="otp-subtitle">Enter the OTP sent to +91 {userDetails.phone}</p>
        </div>

        <form className="otp-form" onSubmit={handleSubmit}>
          <div className="otp-input-wrapper" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="\d{1}"
                maxLength={1}
                className="styled-input otp-input-box"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => { inputsRef.current[index] = el; }}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <button type="submit" className="otp-button" disabled={otp.join('').length !== 6}>
            Verify Signup OTP
          </button>
        </form>

        <div className="otp-footer">
          <div className="resend-section">
            Didn't receive OTP?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); handleResend(); }}>
              Resend OTP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup_OTP_verify;
