import { useEffect, useState } from 'react';

function LoginForm({ handleCancel, setShowForgotPassword, setShowLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = (e) => {
        e.preventDefault();
        console.log("Login");
    }

    const handleForgotPassword = () => {
        setShowForgotPassword(true);
        setShowLogin(false);
    }

    return (
        <form className="forgot-password-form" onSubmit={(e) => { login(e) }}>
            <p>Log in to your account</p>
            <p>Enter your email and password to log in</p>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <p onClick={handleForgotPassword}><u>Forgot your password?</u></p>
            <button type="submit">Log in to my PeerPrep Account!</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
    )
}

export default LoginForm;