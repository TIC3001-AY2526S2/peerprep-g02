import { useState } from 'react';

function SignupForm({handleCancel}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const checkPasswordsMatch = () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return false;
        }
        return true;
    }

    const signup = (e) => {
        e.preventDefault();
        if (!checkPasswordsMatch()) {
            console.log("Signup");
        }
    }
    return (<form className="login-signup-form" onSubmit={(e) => {signup(e)}}>
                <p>Create an account</p>
                <p>Enter your email to sign up to this app</p>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                <button type="submit">Create my PeerPrep Account!</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </form>)
}
export default SignupForm;