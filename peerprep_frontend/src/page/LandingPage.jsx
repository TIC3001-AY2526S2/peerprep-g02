import React, { useEffect, useState } from "react";
import './LandingPage.css';
import Header from '../components/header/Header'
import Hero from "../components/hero/Hero";
import Footer from "../components/footer/Footer";
import MatchingService from "../components/hero/popups/MatchingService";
import { useUser } from "../context/UserContext"

function LandingPage() {
    const [isLoggedIn, setLoggedIn] = useState(true);
    const [showAboutUs, setShowAboutUs] = useState(false);
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [showMatching, setShowMatching] = useState(false); //toggle matching service
    const [showCollaboration, setShowCollaboration] = useState(false);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const { login, logout, isTokenExpired } = useUser();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token && !isTokenExpired(token) && user) {
            login(user, token);
        } else {
            logout();
        }
    }, []);
    const headerArgs = {
        isLoggedIn: isLoggedIn,
        setLoggedIn:setLoggedIn,
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
        showQuestionForm: showQuestionForm,
        showMatching: showMatching,
        showCollaboration: showCollaboration,
        setShowLogin: setShowLogin,
        setShowSignup: setShowSignup,
        setShowForgotPassword: setShowForgotPassword,
        setLoggedIn: setLoggedIn,
        setShowQuestionForm: setShowQuestionForm,
        setShowMatching: setShowMatching,
        isLoggedIn:isLoggedIn,
        setShowCollaboration: setShowCollaboration,
    }

    return ( // fixed element duplication on landing page
        <>
            <div className='background-container'>
                <Header
                    isDisabled={showMatching || showCollaboration}
                    {...headerArgs}
                />
                <Hero {...heroArgs} />
                {isLoggedIn && showMatching && (
                    <MatchingService setShowMatching={setShowMatching} />
                )}
                <Footer />
            </div>
        </>
    );
}

export default LandingPage;