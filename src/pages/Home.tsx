import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate('/signup');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className="home-bg">
            {/* Background Logo - Behind Content */}
            
            
            <div className="home-content">
                <div className="home-logo-bg"></div>
                <h1 className="home-welcome">Welcome to</h1>
                <div className="home-title">TRYGVE</div>    
                <p className="home-subtitle">
                    "Your trusted partner for personalized healthcare, right at your doorstep."
                </p>
                
                <div className="home-form">
                    <button 
                        className="home-btn primary" 
                        onClick={handleSignUp}
                    >
                        SIGN UP
                    </button>
                    <button 
                        className="home-btn secondary" 
                        onClick={handleLogin}
                    >
                        LOGIN
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;