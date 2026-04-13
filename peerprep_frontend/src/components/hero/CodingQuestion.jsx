import React, {  useEffect, useState } from "react";
// import sampleQuestion from '../../assets/text/sampleQuestion.txt'
import './CollaborationPage.css';

function CodingQuestion({ question }) {
    const [questionTitle, setQuestionTitle] = useState("");
    const [questionText, setQuestionText] = useState("");

    useEffect(()=>{
        setQuestionText(question.description);
        setQuestionTitle(question.title);
    },[]);

    return (
        <div className="collab-containers question">
            <div className="collabBox question">
                <div className="collab-header-font">{questionTitle}</div>
                <pre>{questionText}</pre>
            </div>
        </div>
    );
}

export default CodingQuestion;