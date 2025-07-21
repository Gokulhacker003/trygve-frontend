import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, Mail, Phone } from 'lucide-react';
import './CreateAccount.css';
import { registerUser } from '../../utils/authStore'; // Use relative path or configure path aliases

function CreateAccount() {
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem('auth_flow_status');
    if (authStatus !== 'can_create_account') {
      console.warn("Direct access to /create-account is not permitted. Redirecting.");
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    location: '',
    secondaryPhone: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    secondaryPhone: '',
  });

  const validate = () => {
    let valid = true;
    const newErrors = { fullName: '', email: '', secondaryPhone: '' };

    // Full Name Validation
    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    } else if (!/^[a-zA-Z\s'-]+$/.test(form.fullName.trim())) {
      newErrors.fullName = 'Only letters, spaces, hyphens, and apostrophes are allowed';
      valid = false;
    }

    // Email Validation
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    // Secondary Phone Validation
    if (!form.secondaryPhone.trim()) {
      newErrors.secondaryPhone = 'Phone number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(form.secondaryPhone)) {
      newErrors.secondaryPhone = 'Phone must be 10 digits';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form Submitted:', form);
      
      // Register the user in authStore
      registerUser({
        fullName: form.fullName,
        email: form.email,
        phone: form.secondaryPhone,
        location: form.location
      });
      
      // Clean up the auth flow status after completion
      localStorage.removeItem('auth_flow_status');
      
      // Navigate to back-to-login page with the user's name
      navigate('/back-to-login', { state: { name: form.fullName } });
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <button onClick={() => navigate(-1)} className="profile-back-button">
          ←
        </button>

        <div className="profile-header">
          <h2 className="profile-title">Almost Done!</h2>
          <p className="profile-subtitle">
            Please enter your details to complete your account setup.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form" noValidate>
          {/* Full Name */}
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input
              type="text"
              name="fullName"
              placeholder="Enter Full Name"
              value={form.fullName}
              onChange={handleChange}
              className={`profile-input ${errors.fullName ? 'input-error' : ''}`}
            />
            {errors.fullName && <p className="error-message">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={form.email}
              onChange={handleChange}
              className={`profile-input ${errors.email ? 'input-error' : ''}`}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          {/* Location (readonly) */}
          <div className="input-group">
            <div className="location-wrapper">
              <input
                type="text"
                name="location"
                placeholder='Enter Your Location'
                value={form.location}
                onChange={handleChange}
                className="profile-input location-input"
              />
              <MapPin className="location-icon" size={20} />
            </div>
          </div>

          {/* Secondary Phone */}
          <div className="input-group">
            <Phone className="input-icon" size={20} />
            <input
              type="tel"
              name="secondaryPhone"
              placeholder="Enter Secondary Phone Number"
              value={form.secondaryPhone}
              onChange={handleChange}
              className={`profile-input ${errors.secondaryPhone ? 'input-error' : ''}`}
              maxLength={10}
            />
            {errors.secondaryPhone && <p className="error-message">{errors.secondaryPhone}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="profile-submit-button">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;