import React, { useEffect, useState } from "react";
import sampleQuestion from '../../assets/text/sampleQuestion.txt'
import sampleCode from '../../assets/text/sampleCode.txt'
import './CollaborationPage.css';

function CollaborationPage() {
    const [questionText, setQuestionText] = useState("");
    const [codeText, setCodeText] = useState("");

    useEffect(() => {
        fetch(sampleQuestion)
            .then(res => res.text())
            .then(text => setQuestionText(text));

        fetch(sampleCode)
            .then(res => res.text())
            .then(text => setCodeText(text));
    }, []);

    return (
        <div className="collaboration-main-container">

            <div className="collab-containers question">
                <div className="collabBox question">
                    <div className="collab-header-font">9. Add Binary</div>
                    <pre>{questionText}</pre>
                </div>
            </div>

            <div className="collab-containers code">
                {/* <div className="collabBox code">
                    <pre>{codeText}</pre>
                </div> */}
            </div>

            <div className="collab-containers chat">
                {/* <div className="collabBox chat">Chat</div> */}
            </div>

        </div>
    );
}

export default CollaborationPage;