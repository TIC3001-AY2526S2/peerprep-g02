import React, { useState } from "react";
import './LandingPage.css';
import Header from '../components/header/Header'
import Hero from "../components/hero/Hero";
import Footer from "../components/footer/Footer";

function LandingPage() {
    const[isLoggedIn, setLoggedIn] = useState(false);
    const[showAboutUs, setShowAboutUs] = useState(false);
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const headerArgs = {
        isLoggedIn: isLoggedIn,
        setShowAboutUs: setShowAboutUs,
        setShowHowToPlay: setShowHowToPlay,
        setShowQuestions: setShowQuestions,
        setShowLogin: setShowLogin,
        setShowSignup: setShowSignup,
        setShowForgotPassword: setShowForgotPassword
    }

    const heroArgs = {
        showAboutUs: showAboutUs,
        showHowToPlay: showHowToPlay,
        showQuestions: showQuestions,
        showLogin: showLogin,
        showSignup: showSignup,
        showForgotPassword: showForgotPassword,
        setShowLogin: setShowLogin,
        setShowSignup: setShowSignup,
        setShowForgotPassword: setShowForgotPassword
    }

    return (
        <>
        <div className='background-container'>
            
            <Header {...headerArgs}/>

            <Hero {...heroArgs}/>

            <Footer />
        </div>
</>
    );
}

export default LandingPage;