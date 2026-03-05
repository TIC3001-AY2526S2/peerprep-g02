import React, { useState,useEffect } from "react";
import About from "./About";
import HowToPlay from "./HowToPlay";
import Questions from "./Questions";
import FindMatch from "./FindMatch";
import LoginSignup from "./popups/LoginSignup";
import { getTopics } from "../../api/QuestionApi";
import QuestionForm from "./popups/QuestionForm";

function Hero({ ...heroArgs }) {
    const { showAboutUs, showHowToPlay, showQuestions, showLogin, showSignup, setShowLogin, setShowSignup, showForgotPassword, setShowForgotPassword, setLoggedIn, showQuestionForm, setShowQuestionForm } = heroArgs;
    const [topicOptions, setTopicOptions] = useState([]);

    const [selectedQuestion, setSelectedQuestion] = useState({})
    
    useEffect(() => {
        get_topics(setTopicOptions);
    }, []);

    const get_topics = async (setTopicOptions)=>{
        const topics = await getTopics();
        setTopicOptions(topics)
    }

    const handleCancelQuestion = () => {
        setShowQuestionForm(false);
    }

    const loginSignupArgs = {
        showLogin: showLogin,
        showSignup: showSignup,
        showForgotPassword: showForgotPassword,
        setShowLogin: setShowLogin,
        setShowSignup: setShowSignup,
        showForgotPassword: showForgotPassword,
        setShowForgotPassword: setShowForgotPassword,
        setLoggedIn: setLoggedIn
    }

    const questionArgs = {
        showQuestionForm: showQuestionForm,
        setShowQuestionForm: setShowQuestionForm,
        handleCancelQuestion: handleCancelQuestion,
        setSelectedQuestion: setSelectedQuestion
    }



    return (
        <div className="hero-section-wrapper">
            {showAboutUs && <About />}
            {showHowToPlay && <HowToPlay />}
            {showQuestions && <Questions {...questionArgs} />}
            {!showAboutUs && !showHowToPlay && !showQuestions && <FindMatch topicOptions={topicOptions}/>}
            {(showLogin || showSignup || showForgotPassword) && <LoginSignup {...loginSignupArgs} />}
            {showQuestionForm && <QuestionForm handleCancelQuestion={handleCancelQuestion} question={selectedQuestion} topics={topicOptions}/>}
        </div>
    );
}

export default Hero;