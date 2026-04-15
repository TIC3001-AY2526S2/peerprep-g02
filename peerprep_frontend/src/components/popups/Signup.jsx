import { useState } from 'react';
import { signup } from '../../api/UserApi';

function SignupForm({ handleCancel, setShowLogin, setShowSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");

    const isValidPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        return regex.test(password);
    };

    const signup_user = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return alert("Passwords do not match!");
        }

        const isRegistered = await signup(email, password, username);

        if (isRegistered) {
            alert("User registration successful! Please log in.");
            setShowSignup(false);
            setShowLogin(true);
        } else {
            alert("Error occurred during registration.");
        }
    };

    return (
        <form className="login-signup-form" onSubmit={signup_user}>
            <div className="close-button" onClick={handleCancel}>&times;</div>

            <div className="text-wrapper">
                <div className="title-font">Create an account</div>
                <div className="italic-font">Enter your email to sign up to this app</div>
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

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />

            <div className="italic-font">
                Password must be at least 8 characters and include uppercase, lowercase, and a number
            </div>

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}"
                onInvalid={(e) =>
                    e.target.setCustomValidity(
                        "Password must be at least 8 characters and include uppercase, lowercase, and a number"
                    )
                }
                onInput={(e) => e.target.setCustomValidity("")}
            />

            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />

            <button type="submit">Create my PeerPrep Account!</button>
        </form>
    );
}

export default SignupForm;