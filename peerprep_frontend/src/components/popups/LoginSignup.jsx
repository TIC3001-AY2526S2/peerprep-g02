import LoginForm from './Login';
import './loginSignup.css';
import SignupForm from './Signup';
function LoginSignup({ ...loginSignupArgs }) {
    const { showLogin, showSignup, setShowLogin, setShowSignup, showForgotPassword, setShowForgotPassword, setLoggedIn } = loginSignupArgs;

    const handleCancel = () => {
        setShowLogin(false);
        setShowSignup(false);
        setShowForgotPassword(false);
    }

    return (
        <div className="popup-overlay" onClick={handleCancel}>
            <div
                className="login-signup-container"
                onClick={(e) => e.stopPropagation()}
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
                        setShowLogin={setShowLogin}
                        setLoggedIn={setLoggedIn}
                        setShowSignup={setShowSignup}
                    />
                )}
            </div>
        </div>
    );
}
export default LoginSignup;