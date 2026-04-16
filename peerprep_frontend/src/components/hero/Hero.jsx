import React, { useState, useEffect } from "react";
import About from "./About";
import HowToPlay from "./HowToPlay";
import Questions from "./Questions";
import FindMatch from "./FindMatch";
import CollaborationPage from "./CollaborationPage";
import LoginSignup from "../popups/LoginSignup";
import { getTopics } from "../../api/QuestionApi";
import QuestionForm from "../popups/QuestionForm";
import Profile from "./Profile";

function Hero({ ...heroArgs }) {
    const {
        showAboutUs,
        showHowToPlay,
        showQuestions,
        showLogin,
        showSignup,
        setShowLogin,
        setShowSignup,
        showForgotPassword,
        setShowForgotPassword,
        setLoggedIn,
        showQuestionForm,
        setShowQuestionForm,
        showMatching,
        setShowMatching,
        showCollaboration,
        setShowCollaboration,
        showProfile,
        setShowProfile,
        isLoggedIn,
        setSelectedTopic,
        setSelectedDifficulty,
        selectedTopic,
        selectedDifficulty
    } = heroArgs;

    const [topicOptions, setTopicOptions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState();
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        get_topics();
    }, []);

    const get_topics = async () => {
        const topics = await getTopics();
        setTopicOptions(topics);
    };

    const handleCancelQuestion = () => {
        setShowQuestionForm(false);
    };

    const loginSignupArgs = {
        showLogin,
        showSignup,
        showForgotPassword,
        setShowLogin,
        setShowSignup,
        setShowForgotPassword,
        setLoggedIn,
        showCollaboration,
        showProfile,
        isLoggedIn
    };

    const questionArgs = {
        showQuestionForm,
        setShowQuestionForm,
        handleCancelQuestion,
        setSelectedQuestion,
        questions,
        setQuestions,
        setUpdate,
        setShowProfile
    };

    return (
        <div className="hero-section-wrapper">
            {showAboutUs && <About />}
            {showHowToPlay && <HowToPlay />}
            {showQuestions && <Questions {...questionArgs} />}
            {showProfile && <Profile />}

            {showCollaboration && (
                <CollaborationPage
                    onExitCollab={() => {
                        setShowCollaboration(false);
                    }}
                />
            )}

            {!showAboutUs &&
                !showHowToPlay &&
                !showQuestions &&
                !showCollaboration &&
                !showMatching &&
                !showProfile && (
                    <FindMatch
                        selectedDifficulty={selectedDifficulty}
                        setSelectedDifficulty={setSelectedDifficulty}
                        selectedTopic={selectedTopic}
                        setSelectedTopic={setSelectedTopic}
                        topicOptions={topicOptions}
                        isLoggedIn={isLoggedIn}
                        showMatching={showMatching}
                        setShowMatching={setShowMatching}
                        setShowCollaboration={setShowCollaboration}
                        setShowLogin={setShowLogin}
                    />
                )}

            {(showLogin || showSignup || showForgotPassword) && (
                <LoginSignup {...loginSignupArgs} />
            )}
            {showQuestionForm && (
                <QuestionForm
                    handleCancelQuestion={handleCancelQuestion}
                    question={selectedQuestion}
                    topics={topicOptions}
                    setQuestions={setQuestions}
                    questions={questions}
                    update={update}
                />
            )}
        </div>
    );
}

export default Hero;