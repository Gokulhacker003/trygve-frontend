import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  User,
  LogOut,
  HeartPulse,
  ClipboardList,
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any logout logic here (e.g., clearing tokens)
    console.log('User logged out');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src="/assets/medical-logo.png" alt="Logo" className="sidebar-logo" />
          <h1 className="sidebar-title">Trygve</h1>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/appointments" className="nav-item">
            <Calendar size={20} />
            <span>Appointments</span>
          </Link>
          <Link to="/profile" className="nav-item">
            <User size={20} />
            <span>Profile</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="main-header">
          <h2 className="header-title">Welcome to TRYGVE</h2>
          <div className="header-actions">
            <div className="user-profile">
              <span>John Doe</span>
              <div className="user-avatar">JD</div>
            </div>
          </div>
        </header>

        <div className="content-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <Calendar size={22} />
              <h3>Upcoming Appointments</h3>
            </div>
            <div className="card-body">
              <p>You have <strong>2</strong> appointments scheduled for this week.</p>
              <p>Next: Dr. Smith - Cardiology - July 22, 2025 at 10:00 AM</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <HeartPulse size={22} />
              <h3>Health Summary</h3>
            </div>
            <div className="card-body">
              <p>Your recent vitals are stable. Blood pressure: 120/80 mmHg.</p>
              <p>No new alerts or recommendations.</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <ClipboardList size={22} />
              <h3>Recent Activity</h3>
            </div>
            <div className="card-body">
              <p>New lab results available for your review.</p>
              <p>Prescription for 'Metformin' was refilled on July 18, 2025.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
