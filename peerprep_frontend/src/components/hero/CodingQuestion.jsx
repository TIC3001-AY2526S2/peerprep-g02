import React, { useEffect, useState } from "react";
// import sampleQuestion from '../../assets/text/sampleQuestion.txt'
import './CollaborationPage.css';

function CodingQuestion({ question }) {

    return (
        <>
            {question &&
                <div className="collab-containers question">
                    <div className="collabBox question">
                        <div className="collab-header-font">{question.title}</div>
                        <div>{question.description}</div>
                    </div>
                </div>
            }
        </>
    );
}

export default CodingQuestion;