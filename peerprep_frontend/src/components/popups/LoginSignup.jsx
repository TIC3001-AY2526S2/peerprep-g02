import { useEffect, useState } from 'react';
import LoginForm from './Login';
import './loginSignup.css';
import SignupForm from './Signup';
import ForgotPassword from './ForgotPassword';
function LoginSignup({ ...loginSignupArgs }) {
    const { showLogin, showSignup, setShowLogin, setShowSignup, showForgotPassword, setShowForgotPassword, setLoggedIn } = loginSignupArgs;

    const handleCancel = () => {
        setShowLogin(false);
        setShowSignup(false);
        setShowForgotPassword(false);
    }

    return (
<<<<<<< Updated upstream
        <div className="popup-overlay" onClick={handleCancel}>
            <div
                className="login-signup-container"
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
                {showSignup && (
                    <SignupForm
                        handleCancel={handleCancel}
                        setShowLogin={setShowLogin}
                        setShowSignup={setShowSignup}
                    />
                )}

                {showLogin && (
                    <LoginForm
                        handleCancel={handleCancel}
                        setShowForgotPassword={setShowForgotPassword}
                        setShowLogin={setShowLogin}
                        setLoggedIn={setLoggedIn}
                    />
                )}

                {showForgotPassword && (
                    <ForgotPassword handleCancel={handleCancel} />
                )}
            </div>
        </div>
    );
=======
        <>
            {(showSignup || showLogin || showForgotPassword) &&
                <div className='login-signup-container'>
                    {showSignup && (
                        <SignupForm handleCancel={handleCancel} setShowLogin={setShowLogin} />
                    )}
                    {showLogin && (
                        <LoginForm handleCancel={handleCancel} setShowForgotPassword={setShowForgotPassword} setShowLogin={setShowLogin} setLoggedIn={setLoggedIn} />
                    )}
                    {showForgotPassword && (
                        <ForgotPassword handleCancel={handleCancel} />
                    )}
                </div>
            }
        </>
    )
>>>>>>> Stashed changes
}
export default LoginSignup;