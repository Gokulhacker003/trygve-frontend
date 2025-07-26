import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';

interface WelcomeState {
  from: 'welcome';
  name: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const [username, setUsername] = useState('User');

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    console.log('authStatus:', authStatus);

    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      console.warn('User is not authenticated. Redirecting to login...');
      navigate('/login', { replace: true });
      return;
    }

    const state = location.state as WelcomeState | null;

    if (state?.from === 'welcome' && state.name) {
      setUsername(state.name);
      setIsAllowed(true);
    } else {
      console.warn('Unauthorized access to /dashboard. Redirecting...');
      navigate('/login', { replace: true });
    }
  }, [navigate, location.state]);

  const handleLogout = () => {
    // Clear authentication status
    localStorage.removeItem('isAuthenticated');

    // Redirect to login
    navigate('/login', { replace: true });
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Display a loading indicator
  }

  if (!isAllowed) {
    return null; // Don't render anything if not allowed
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src="/logo.png" alt="Logo" className="sidebar-logo" />
          <h1 className="sidebar-title">Dashboard</h1>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item">Home</a>
          <a href="#" className="nav-item">Profile</a>
          <a href="#" className="nav-item">Settings</a>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item active">Logout</button>
          <p>&copy; 2025 Your Company</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="main-header">
          <h1 className="header-title">Welcome, {username}!</h1>
          <div className="header-actions">
            <div className="user-profile">
              <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
              <span>{username}</span>
            </div>
          </div>
        </header>
        <section className="content-grid">
          <div className="dashboard-card">
            <div className="card-header">Card Title</div>
            <div className="card-body">This is a placeholder for card content.</div>
          </div>
          <div className="dashboard-card">
            <div className="card-header">Card Title</div>
            <div className="card-body">This is a placeholder for card content.</div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
