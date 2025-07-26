import React from 'react';
// Remove BrowserRouter, it's now in App.tsx
import { Routes, Route } from 'react-router-dom'; 
import Onboarding from '@/components/Onboarding';
import Login from '@/components/Login/Login';
import SignUp from '@/components/Sign UP/SignUp';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
// Import the new unified component
import OtpVerification from '@/components/common/OtpVerification'; // Adjust path if needed
import CreateAccount from '@/components/Sign UP/CreateAccount';
import WelcomePage from '@/pages/WelcomePage';
import BackToLogin from '@/pages/backtoLogin';

export default function AppRoutes() {
  return (
    // The <Routes> component works because it's inside the <Router> from App.tsx
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Onboarding />} />
      <Route path="/home" element={<Home />} />
      
      {/* --- Authentication Flow --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Use the new unified OTP route */}
      <Route path="/otp-verify" element={<OtpVerification />} />
      
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/back-to-login" element={<BackToLogin />} />
      {/* App Routes */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Catch-all Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
