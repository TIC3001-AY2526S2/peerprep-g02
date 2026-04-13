import React, { useEffect, useState } from "react";
import './LandingPage.css';
import Header from '../components/header/Header'
import Hero from "../components/hero/Hero";
import Footer from "../components/footer/Footer";
<<<<<<< Updated upstream
import { useUser } from "../context/UserContext"
=======
import MatchingService from "../components/hero/popups/MatchingService";
import CollaborationHeader from "../components/header/CollaborationHeader";
import CollaborationPage from "../components/hero/CollaborationPage";
import { useUser } from "../context/UserContext";
>>>>>>> Stashed changes

function LandingPage() {
    const [isLoggedIn, setLoggedIn] = useState(false);
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
<<<<<<< Updated upstream
    const { login, logout, isTokenExpired } = useUser();
=======

    const [uiState, setUiState] = useState({
        showAboutUs: false,
        showHowToPlay: false,
        showQuestions: false,
        showLogin: false,
        showSignup: false,
        showForgotPassword: false,
        showQuestionForm: false,
        showMatching: false,
        showCollaboration: false,
    });

    const [sessionId, setSessionId] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState(null);
>>>>>>> Stashed changes

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
        setShowAboutUs: setShowAboutUs,
        setShowHowToPlay: setShowHowToPlay,
        setShowQuestions: setShowQuestions,
        setShowLogin: setShowLogin,
        setShowSignup: setShowSignup,
        setShowForgotPassword: setShowForgotPassword
    }

<<<<<<< Updated upstream
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
        setShowMatching: setShowMatching,
        setShowLogin: setShowLogin,
        setShowSignup: setShowSignup,
        setShowForgotPassword: setShowForgotPassword,
        setLoggedIn: setLoggedIn,
        setShowQuestionForm: setShowQuestionForm,
        setShowCollaboration: setShowCollaboration,
    }

    return (
        <>
            <div className='background-container'>
                <Header isDisabled={showMatching || showCollaboration} {...headerArgs} />
                <>
                    <Hero {...heroArgs} />
                </>
                <Footer />
            </div>
        </>
=======
    const updateUi = (updates) => setUiState(prev => ({ ...prev, ...updates }));

    const handleExit = () => {
        setSessionId(null);
        setSelectedTopic("");
        setSelectedDifficulty("");
        setSelectedQuestion(null);
        updateUi({ showCollaboration: false, showMatching: false });
    };

    if (uiState.showCollaboration) {
        return (
            <div className="background-container">
                <CollaborationHeader />
                <CollaborationPage
                    sessionId={sessionId}
                    questionId={selectedQuestion?.id}
                    onExitCollab={handleExit}
                />
            </div>
        );
    }

    return (
        <div className="background-container">
            <Header
                isLoggedIn={isLoggedIn}
                setLoggedIn={setLoggedIn}
                isHeaderDisabled={uiState.showMatching}
                setShowAboutUs={(val) => updateUi({ showAboutUs: val })}
                setShowHowToPlay={(val) => updateUi({ showHowToPlay: val })}
                setShowQuestions={(val) => updateUi({ showQuestions: val })}
                setShowLogin={(val) => updateUi({ showLogin: val })}
                setShowSignup={(val) => updateUi({ showSignup: val })}
                setShowForgotPassword={(val) => updateUi({ showForgotPassword: val })}
            />

            <Hero
                {...uiState}
                isLoggedIn={isLoggedIn}
                selectedTopic={selectedTopic}
                selectedDifficulty={selectedDifficulty}
                setLoggedIn={setLoggedIn}
                setSelectedTopic={setSelectedTopic}
                setSelectedDifficulty={setSelectedDifficulty}
                setShowLogin={(val) => updateUi({ showLogin: val })}
                setShowSignup={(val) => updateUi({ showSignup: val })}
                setShowForgotPassword={(val) => updateUi({ showForgotPassword: val })}
                setShowQuestionForm={(val) => updateUi({ showQuestionForm: val })}
                setShowMatching={(val) => updateUi({ showMatching: val })}
                setShowCollaboration={(val) => updateUi({ showCollaboration: val })}
            />

            {isLoggedIn && uiState.showMatching && selectedTopic && selectedDifficulty && (
                <MatchingService
                    selectedTopic={selectedTopic}
                    selectedDifficulty={selectedDifficulty}
                    onClose={() => updateUi({ showMatching: false })}
                    onConfirm={(roomId, question) => {
                        setSessionId(roomId);
                        setSelectedQuestion(question);
                        updateUi({
                            showMatching: false,
                            showCollaboration: true
                        });
                    }}
                />
            )}

            <Footer />
        </div>
>>>>>>> Stashed changes
    );
}

export default LandingPage;