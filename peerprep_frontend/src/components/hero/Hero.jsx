import React, { useState } from "react";
import About from "./About";
import HowToPlay from "./HowToPlay";
import Questions from "./Questions";
import FindMatch from "./FindMatch";
import LoginSignup from "./LoginSignup/LoginSignup";

function Hero({ ...heroArgs }) {
    const { showAboutUs, showHowToPlay, showQuestions, showLogin, showSignup, setShowLogin, setShowSignup, showForgotPassword, setShowForgotPassword, setLoggedIn } = heroArgs;

    const loginSignupArgs = {
        showLogin: showLogin,
        showSignup: showSignup,
        showForgotPassword: showForgotPassword,
        setShowLogin: setShowLogin,
        setShowSignup: setShowSignup,
        showForgotPassword: showForgotPassword,
        setShowForgotPassword: setShowForgotPassword,
        setLoggedIn:setLoggedIn
    }

    return (
        <div className="hero-section-wrapper">
            {showAboutUs && <About />}
            {showHowToPlay && <HowToPlay />}
            {showQuestions && <Questions />}
            {!showAboutUs && !showHowToPlay && !showQuestions && <FindMatch />}
            {(showLogin || showSignup || showForgotPassword) && <LoginSignup {...loginSignupArgs} />}
        </div>
    );
}

export default Hero;