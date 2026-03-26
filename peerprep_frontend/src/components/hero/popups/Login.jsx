import { useEffect, useState } from 'react';
import { loginUser } from '../../../api/UserApi';
import { useUser } from '../../../context/UserContext';

function LoginForm({ handleCancel, setShowForgotPassword, setShowLogin, setLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useUser();

    const login_user = async (e) => {
        e.preventDefault();
        const user = await loginUser(email, password);
        if (user){
            setLoggedIn(true);
            login(user.user, user.token);
            setShowLogin(false);
        }
    }

    const handleForgotPassword = () => {
        setShowForgotPassword(true);
        setShowLogin(false);
    }

    return (
        <form className="forgot-password-form" onSubmit={(e) => { login_user(e) }}>
            <p>Log in to your account</p>
            <p>Enter your email and password to log in</p>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <a href="#" onClick={handleForgotPassword}>Forgot your password?</a>
            <button type="submit">Log in to my PeerPrep Account!</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
    )
}

export default LoginForm;