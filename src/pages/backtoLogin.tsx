import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import './WelcomePage.css'; // Reusing the welcome page styles

function BackToLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const state = location.state as { name: string } | null;
    
    // Only allow access from account creation flow
    if (state?.name) {
      setIsAllowed(true);
      setUserName(state.name);
      
      // Clear any existing authentication
      localStorage.removeItem('auth_session');
    } else {
      // Redirect if accessed directly
      console.warn("Invalid access to account creation confirmation page.");
      navigate('/home', { replace: true });
    }
  }, [location.state, navigate]);

  const handleLoginNow = () => {
    navigate('/login', { replace: true });
  };

  // Only render the content if the user is allowed to be here
  if (!isAllowed) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <CheckCircle className="welcome-icon" size={60} color="#4CAF50" />
        <h1 className="welcome-title">Account Created!</h1>
        <p className="welcome-subtitle">
          Congratulations {userName}! Your account has been successfully created. 
          Please log in to access your dashboard.
        </p>
        <button onClick={handleLoginNow} className="welcome-button">
          Log In Now
        </button>
      </div>
    </div>
  );
}

export default BackToLogin;