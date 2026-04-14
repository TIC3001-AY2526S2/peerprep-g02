import React, { useEffect, useState } from "react";
import './LandingPage.css';
import Header from '../components/header/Header';
import Hero from "../components/hero/Hero";
import Footer from "../components/footer/Footer";
import MatchingService from "../components/popups/MatchingService";
import CollaborationPage from "../components/hero/CollaborationPage";
import { useUser } from "../context/UserContext";

function LandingPage() {
    const { login, logout, isTokenExpired } = useUser();
    const [isLoggedIn, setLoggedIn] = useState(true);
    const user = JSON.parse(sessionStorage.getItem("user"));

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

    const updateUi = (updates) => setUiState(prev => ({ ...prev, ...updates }));

    const handleExit = () => {
        setSessionId(null);
        setSelectedTopic("");
        setSelectedDifficulty("");
        updateUi({ showCollaboration: false, showMatching: false });
    };

    if (uiState.showCollaboration) {
        return (
            <div className="background-container">
                <CollaborationPage
                    sessionId={sessionId}
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
                    onConfirm={(roomId) => {
                        setSessionId(roomId);
                        updateUi({ showMatching: false, showCollaboration: true });
                    }}
                />
            )}

            <Footer />
        </div>
    );
}

export default LandingPage;