import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PartyPopper } from 'lucide-react';
import './WelcomePage.css';

interface LoginWelcomeState {
  name: string;
  from: 'login';
}

function WelcomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('User');
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const state = location.state as LoginWelcomeState | null;

    // ✅ Only allow access from login flow with name
    if (state?.from === 'login' && state.name) {
      setUserName(state.name.split(' ')[0]); // Use first name
      setIsAllowed(true);
    } else {
      console.warn('Unauthorized access to /welcome. Redirecting...');
      navigate('/login', { replace: true });
    }
  }, [location.state, navigate]);

  const handleContinue = () => {
    navigate('/dashboard', {
      state: { from: 'welcome', name: userName },
      replace: true,
    });
  };

  if (!isAllowed) return null; // Prevent UI flash during redirect

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <PartyPopper className="welcome-icon" size={60} />
        <h1 className="welcome-title">Welcome, {userName}!</h1>
        <p className="welcome-subtitle">
          Your login was successful. Click below to continue.
        </p>
        <button onClick={handleContinue} className="welcome-button">
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
