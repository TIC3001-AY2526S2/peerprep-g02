import React, { useState } from "react";
import logo from '../../assets/images/logo.jpg';
import { useUser } from "../../context/UserContext";


function LoginSignupOptions({ isLoggedIn, setShowLogin, setShowSignup }) {
    const { user, logout } = useUser()
    const handleShowLogin = () => {
        setShowLogin((prev) => !prev);
        setShowSignup(false); // Ensure signup is hidden when login is shown
    }

    const handleShowSignup = () => {
        setShowSignup((prev) => !prev);
        setShowLogin(false); // Ensure login is hidden when signup is shown
    }
    
    return (
        <div className='login-group'>
            {!user && <>
                <div className='button' onClick={handleShowLogin}>Login</div>
                <div className='button' onClick={handleShowSignup}>Sign Up</div>
            </>}
            {user && <>
                <div className='button' onClick={logout}>Log out</div>
                <p>{user}</p>
                <img src={logo} alt="Logo" className="profile-image" />
            </>
            }
        </div>
    )
}

export default LoginSignupOptions;
