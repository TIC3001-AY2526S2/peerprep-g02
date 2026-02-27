import React, { useState } from "react";
import logo from '../../assets/images/logo.jpg';

function LoginSignup(isLoggedIn) {
    const[displayLoginSignup, setDisplayLoginSignup] = useState(false);
    const[loginPage, setLoginPage] = useState(true);
    return (
        <div className='login-group'>
            <div className='button'>Login</div>
            <div className='button'>Sign Up</div>
            <img src={logo} alt="Logo" className="profile-image" />
        </div>
    )
}

export default LoginSignup;
