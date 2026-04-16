import { useState } from 'react';
import { loginUser } from '../../api/UserApi';
import { useUser } from '../../context/UserContext';

function LoginForm({ handleCancel, setShowForgotPassword, setShowLogin, setLoggedIn, setShowSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useUser();

    const login_user = async (e) => {
        e.preventDefault();
        const user = await loginUser(email, password);
        if (user) {
            setLoggedIn(true);
            login(user.user, user.token);
            setShowLogin(false);
        }
    }

    return (
        <>
            <form className="login-signup-form" onSubmit={(e) => { login_user(e) }}>
                <div className='close-button' onClick={handleCancel}>&times;</div>
                <div className='text-wrapper'>
                    <div className='title-font'>Login</div>
                    <div className='italic-font'>Enter your email and password to log in</div>
                </div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    onInvalid={(e) =>
                        e.target.setCustomValidity("Please enter a valid email address. Format: xxx@yyy.com")
                    }
                    onInput={(e) => e.target.setCustomValidity("")}
                />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Log In</button>
                <div
                    className='signup-link'
                    onClick={() => {
                        setShowLogin(false);
                        setShowSignup(true);
                    }}
                >
                    No account yet? Sign up here!
                </div>
            </form>
        </>
    )
}

export default LoginForm;