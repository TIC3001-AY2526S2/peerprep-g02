import { useEffect, useState } from 'react';
import LoginForm from './Login';
import './loginSignup.css';
import SignupForm from './Signup';
import ForgotPassword from './ForgotPassword';
function LoginSignup({ ...loginSignupArgs }) {
    const { showLogin, showSignup, setShowLogin, setShowSignup, showForgotPassword, setShowForgotPassword } = loginSignupArgs;

    const handleCancel = () => {
        setShowLogin(false);
        setShowSignup(false);
        setShowForgotPassword(false);
    }

    return (
        <div className='login-signup-container'>
            {showSignup && (
                <SignupForm handleCancel={handleCancel} />
            )}
            {showLogin && (
                <LoginForm handleCancel={handleCancel} setShowForgotPassword={setShowForgotPassword} setShowLogin={setShowLogin} />
            )}
            {showForgotPassword && (
                <ForgotPassword handleCancel={handleCancel} />
            )}
        </div>
    )
}

export default LoginSignup;