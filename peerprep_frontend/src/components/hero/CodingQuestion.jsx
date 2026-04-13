import React, { useEffect, useState } from "react";
import './CollaborationPage.css';

function CodingQuestion({ question }) {
    const [questionTitle, setQuestionTitle] = useState("");
    const [questionText, setQuestionText] = useState("");

    useEffect(() => {
        if (question) {
            setQuestionTitle(question.title || "");
            setQuestionText(question.description || "");
        }
    }, [question]);

    if (!question) {
        return <div className="collab-containers question">No question found.</div>;
    }

    return (
        <div className="collab-containers question">
            <div className="collabBox question">
                <div className="collab-header-font">{questionTitle}</div>
                <div>{questionText}</div>
            </div>
        </div>
    );
}

export default CodingQuestion;