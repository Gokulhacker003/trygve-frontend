  import React, { useEffect, useRef, useState } from 'react';
  import { useNavigate, useLocation } from 'react-router-dom';
  import '../common/OTP_verify.css';

  interface LoginOTPState {
    email: string;
    phone: string;
    fullName: string;
    flow  : 'login';
    otp: string;
  }

  function Login_OTP_verify() {
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [correctOtp, setCorrectOtp] = useState({right_otp:''});
    const [userDetails, setUserDetails] = useState({ email: '', phone: '',Username:' '});
    const [isLoading, setIsLoading] = useState(true);

    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const location = useLocation(); 

    useEffect(() => {
  const state = location.state as LoginOTPState | null;
  if (state?.email && state.phone &&state.fullName &&state.flow === 'login' && state.otp) {
    setUserDetails({ email: state.email, phone: state.phone, Username:state.fullName})
    setIsLoading(false);
    setCorrectOtp({right_otp:state.otp})
  } else {
    alert('Session expired. Please login again.');
    navigate('/login');
  }
}, [location.state, navigate]);


    useEffect(() => {
      if (!isLoading) {
        inputsRef.current[0]?.focus();
      }
    }, [isLoading]);

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
      if (enteredCode.length !== 6) {
        alert('Please enter a 6-digit OTP');
        return;
      }

      if (enteredCode === correctOtp.right_otp) {
        alert('Login OTP verified successfully!');
        console.log(userDetails.Username);
        navigate('/welcome', {
          state: {
            name: userDetails.Username, // or full name if you collected it
            from: 'login',
          },
        });
      } else {
        alert('Incorrect OTP. Please try again.');
        setOtp(Array(6).fill(''));
        inputsRef.current[0]?.focus();
      }
    };

    const handleResend = () => {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setCorrectOtp({right_otp:newOtp});
      console.log('Resent OTP (Dev):', newOtp);
      alert(`New OTP resent to +91 ${userDetails.phone} and ${userDetails.email}`);
      setOtp(Array(6).fill(''));
      inputsRef.current[0]?.focus();
    };

    const handleBack = () => {
      navigate('/login');
    };

    if (isLoading) {
      return (
        <div className="otp-containered">
          <div className="otp-content">
            <h1 className="otp-title">Loading...</h1>
            <p className="otp-subtitle">Preparing login OTP verification</p>
          </div>
        </div>
      );
    }

    return (
      <div className="otp-containered">
        <button className="back-button-fixed" onClick={handleBack} aria-label="Go back to login">
          ←
        </button>

        <div className="otp-content">
          <div className="otp-header">
            <h1 className="otp-title">Login OTP Verification</h1>
            <p className="otp-subtitle">Enter the 6-digit OTP sent to +91 {userDetails.phone} and {userDetails.email}</p>
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

            <button
              type="submit"
              className="otp-button"
              disabled={otp.join('').length !== 6}
            >
              Verify OTP
            </button>
          </form>

          <div className="otp-footer">
            Didn't receive OTP?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); handleResend(); }}>
              Resend OTP
            </a>
          </div>
        </div>
      </div>
    );
  }

  export default Login_OTP_verify;
