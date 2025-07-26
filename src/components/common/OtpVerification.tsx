import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OTP_verify.css';

interface OtpState {
  flow: 'login' | 'signup';
  phone: string;
  email?: string;
  fullName?: string;
}

function OtpVerification() {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [userDetails, setUserDetails] = useState({ phone: '', email: '', fullName: '' });
  const [mode, setMode] = useState<'login' | 'signup' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as OtpState | null;
    const confirmationResult = (window as any).confirmationResult;
    const failurePath = state?.flow === 'login' ? '/login' : '/signup';

    if (state?.flow && state.phone && confirmationResult) {
      setUserDetails({
        phone: state.phone,
        email: state.email || '',
        fullName: state.fullName || '',
      });
      setMode(state.flow);
      setIsLoading(false);
      console.log('OTP Page Loaded Successfully. Mode:', state.flow);
    } else {
      console.error('OTP Page Error: Missing state or confirmationResult from previous page.');
      alert('Session expired or invalid. Please start the process again.');
      navigate(failurePath, { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (!isLoading) {
      inputsRef.current[0]?.focus();
    }
  }, [isLoading]);

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
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
      setOtp(pasted.split(''));
      inputsRef.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    const enteredCode = otp.join('');
    const confirmationResult = (window as any).confirmationResult;

    if (enteredCode.length !== 6 || !confirmationResult) {
        alert('Please enter a valid 6-digit OTP.');
        setIsVerifying(false);
        return;
    }

    try {
      const result = await confirmationResult.confirm(enteredCode);
      console.log("Firebase sign-in successful:", result.user);
      delete (window as any).confirmationResult;
      localStorage.setItem('isAuthenticated', 'true');

      if (mode === 'login') {
        // *** CHANGE HERE: Use 'login' instead of 'otp-verified' ***
        const stateToSend = { from: 'login', name: userDetails.fullName };
        console.log('LOGIN SUCCESS: Navigating to /welcome with state:', stateToSend);
        navigate('/welcome', { state: stateToSend, replace: true });
      } else {
        // Keep this the same for signup flow
        navigate('/create-account', { 
          state: { from: 'otp-verified' },
          replace: true 
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert('Invalid OTP or error verifying. Please try again.');
      setOtp(Array(6).fill(''));
      inputsRef.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBack = () => {
    navigate(mode === 'login' ? '/login' : '/signup');
  };

  if (isLoading) {
    return (
      <div className="otp-containered"><div className="otp-content"><h1 className="otp-title">Loading...</h1></div></div>
    );
  }

  const isLogin = mode === 'login';
  const title = isLogin ? 'Login OTP Verification' : 'Signup OTP Verification';
  const subtitle = isLogin
    ? `Enter the 6-digit OTP sent to +91 ${userDetails.phone} and ${userDetails.email}`
    : `Enter the OTP sent to +91 ${userDetails.phone}`;
  const buttonText = isVerifying ? 'Verifying...' : (isLogin ? 'Verify OTP' : 'Verify Signup OTP');

  return (
    <div className="otp-containered">
      <button className="back-button-fixed" onClick={handleBack} aria-label={`Back to ${mode}`}>
        ←
      </button>
      <div className="otp-content">
        <div className="otp-header">
          <h1 className="otp-title">{title}</h1>
          <p className="otp-subtitle">{subtitle}</p>
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
          <button type="submit" className="otp-button" disabled={otp.join('').length !== 6 || isVerifying}>
            {buttonText}
          </button>
        </form>
        <div className="otp-footer">
          Having trouble? Go back and try sending the code again.
        </div>
      </div>
    </div>
  );
}

export default OtpVerification;