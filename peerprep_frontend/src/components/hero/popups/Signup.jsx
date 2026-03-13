import { useState } from 'react';
import { signup } from '../../../api/UserApi';

function SignupForm({handleCancel, setShowLogin}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");

    const checkPasswordsMatch = () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return false;
        }
        return true;
    }

    const signup_user = async (e) => {
        e.preventDefault();
        if (!checkPasswordsMatch()) {
            alert("Passwords do not match.");
        }
        else{
            const isRegistered = await signup(email, password, username);
            if (isRegistered){
                handleCancel();
                alert("User Registration successful.")
            }else{
                alert("Error");
            }
        }
    }
    return (<form className="login-signup-form" onSubmit={(e) => {signup_user(e)}}>
                <p>Create an account</p>
                <p>Enter your email to sign up to this app</p>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                <button type="submit">Create my PeerPrep Account!</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </form>)
}
export default SignupForm;