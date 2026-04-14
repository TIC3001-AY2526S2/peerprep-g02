import React, { useState, useEffect } from "react";
import About from "./About";
import HowToPlay from "./HowToPlay";
import Questions from "./Questions";
import FindMatch from "./FindMatch";
import CollaborationPage from "./CollaborationPage";
import LoginSignup from "./popups/LoginSignup";
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
        setShowCollaboration
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

    return (
        <div className="hero-section-wrapper">
            {showAboutUs && <About />}
            {showHowToPlay && <HowToPlay />}
            {showQuestions && <Questions {...questionArgs} />}

            {showCollaboration && selectedQuestion && (
                <CollaborationPage
                    questionId={selectedQuestion.id}
                    onExitCollab={() => {
                        setShowCollaboration(false);
                    }}
                />
            )}

            {!showAboutUs &&
                !showHowToPlay &&
                !showQuestions &&
                !showCollaboration &&
                !showMatching && (
                    <FindMatch
                        topicOptions={topicOptions}
                        showMatching={showMatching}
                        setShowMatching={setShowMatching}
                        setShowCollaboration={setShowCollaboration}
                        setSelectedQuestion={setSelectedQuestion}
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