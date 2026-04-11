import React, { useState, useEffect } from "react";
import About from "./About";
import HowToPlay from "./HowToPlay";
import Questions from "./Questions";
import FindMatch from "./FindMatch";
import CollaborationPage from "./CollaborationPage";
import LoginSignup from "./popups/LoginSignup";
import MatchingService from "./popups/MatchingService";
import { getTopics } from "../../api/QuestionApi";
import QuestionForm from "./popups/QuestionForm";

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
        isLoggedIn
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
        showLogin: showLogin,
        showSignup: showSignup,
        showForgotPassword: showForgotPassword,
        setShowLogin: setShowLogin,
        setShowSignup: setShowSignup,
        setShowForgotPassword: setShowForgotPassword,
        setLoggedIn: setLoggedIn,
        showCollaboration: showCollaboration
    };

    const questionArgs = {
        showQuestionForm: showQuestionForm,
        setShowQuestionForm: setShowQuestionForm,
        handleCancelQuestion: handleCancelQuestion,
        setSelectedQuestion: setSelectedQuestion,
        questions: questions,
        setQuestions: setQuestions,
        setUpdate: setUpdate
    };

    return ( // fixed landing page element duplication issue, missing showCollaboration and showMatching guards and LoginSignup and QuestionForm being doubled during merging
        <div className="hero-section-wrapper">
            {showAboutUs && <About />}
            {showHowToPlay && <HowToPlay />}
            {showQuestions && <Questions {...questionArgs} />}
            {!showAboutUs && !showHowToPlay && !showQuestions && !showCollaboration && !showMatching && (
                <FindMatch topicOptions={topicOptions} setShowMatching={setShowMatching} isLoggedIn={isLoggedIn} />
            )}
            {(showLogin || showSignup || showForgotPassword) && <LoginSignup {...loginSignupArgs} />}
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
            {showMatching && (
                <MatchingService
                    onClose={() => setShowMatching(false)}
                    onConfirm={() => {
                        setShowMatching(false);
                        setShowCollaboration(true);
                    }}
                />
            )}
            {showCollaboration && <CollaborationPage />}
        </div>
    );
}

export default Hero;