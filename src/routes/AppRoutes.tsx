import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboarding from '@/components/Onboarding';
import Login from '@/components/Login/Login';
import SignUp from '@/components/Sign UP/SignUp';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import Login_OTP_verify from '@/components/Login/Login_otp';
import Signup_OTP_verify from '@/components/Sign UP/SignUp_OTP';
import CreateAccount from '@/components/Sign UP/CreateAccount';
import WelcomePage from '@/pages/WelcomePage';
import BackToLogin from '@/pages/backtoLogin';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        
        {/* Authentication Flow */}
        <Route path="/login" element={<Login />} />
        <Route path="/login-otp" element={<Login_OTP_verify />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-otp" element={<Signup_OTP_verify />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/back-to-login" element={<BackToLogin />} />
        {/* App Routes */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Catch-all Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
