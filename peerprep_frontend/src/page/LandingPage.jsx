import React, { useEffect, useState } from "react";
import './LandingPage.css';
import Header from '../components/header/Header'
import CollaborationHeader from '../components/header/CollaborationHeader'
import Hero from "../components/hero/Hero";
import Footer from "../components/footer/Footer";
import MatchingService from "../components/hero/popups/MatchingService";
import { useUser } from "../context/UserContext"
import CollaborationPage from "../components/hero/CollaborationPage";

function LandingPage() {
    const [isLoggedIn, setLoggedIn] = useState(true);
    const [showAboutUs, setShowAboutUs] = useState(false);
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [showMatching, setShowMatching] = useState(false);
    const [showCollaboration, setShowCollaboration] = useState(false);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const { login, logout, isTokenExpired } = useUser();

    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token && !isTokenExpired(token) && user) {
            login(user, token);
            setLoggedIn(true);
        } else {
            logout();
            setLoggedIn(false);
        }
    }, []);

    const headerArgs = {
        isLoggedIn: isLoggedIn,
        setLoggedIn: setLoggedIn,
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
        isLoggedIn: isLoggedIn,
        setShowCollaboration: setShowCollaboration,
        setSelectedTopic: setSelectedTopic,
        setSelectedDifficulty: setSelectedDifficulty,
        selectedTopic: selectedTopic,
        selectedDifficulty: selectedDifficulty
    }

    const closeMatchingService = () => {
        setShowMatching(false);
    };

    const handleExit = () => {
        setShowCollaboration(false);
        setShowMatching(false);
        setSelectedTopic("");
        setSelectedDifficulty("");
    };

    return (
        <div className="background-container">
            {showCollaboration ? (
                <CollaborationHeader />
            ) : (
                <Header
                    isHeaderDisabled={showMatching}
                    {...headerArgs}
                />
            )}
            {showCollaboration ? (
                <CollaborationPage onExitCollab={handleExit} />
            ) : (
                <>
                    <Hero {...heroArgs} />

                    {isLoggedIn && showMatching && (
                        <MatchingService
                            selectedTopic={selectedTopic}
                            selectedDifficulty={selectedDifficulty}
                            onClose={closeMatchingService}
                            onConfirm={() => {
                                setShowMatching(false);
                                setShowCollaboration(true);
                            }}
                        />
                    )}

                    <Footer />
                </>
            )}
        </div>
    );
}

export default LandingPage;