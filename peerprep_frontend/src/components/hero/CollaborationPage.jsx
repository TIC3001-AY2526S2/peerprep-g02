<<<<<<< Updated upstream
import React, { useEffect, useState } from "react";
import sampleQuestion from '../../assets/text/sampleQuestion.txt'
import sampleCode from '../../assets/text/sampleCode.txt'
import './CollaborationPage.css';

function CollaborationPage() {
    const [questionText, setQuestionText] = useState("");
    const [codeText, setCodeText] = useState("");
=======
import React, { useState, useEffect, useRef } from "react";
import Chat from "./Chat";
import Coding from "./Coding";
import CodingQuestion from "./CodingQuestion";
import "./CollaborationPage.css";
import ReviewStats from "../hero/popups/ReviewStats";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

function CollaborationPage({ sessionId, topic, difficulty, onExitCollab, questionId }) {
    const [showReviewStats, setShowReviewStats] = useState(false);
    const [partnerOnline, setPartnerOnline] = useState(false);

    const ydocRef = useRef(null);
    const providerRef = useRef(null);
>>>>>>> Stashed changes

    useEffect(() => {
        fetch(sampleQuestion)
            .then(res => res.text())
            .then(text => setQuestionText(text));

<<<<<<< Updated upstream
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
                <div className="collabBox timer">
                    <div className="collab-header-font">Timer:<br></br>03 Mins 40 Sec</div>
                    <div className="collab-buttons" >
                        Submit
                    </div>
                </div>
            </div>

            <div className="collab-containers code">
                <div className="collabBox code">
                    <pre>{codeText}</pre>
                </div>
                <div className="collabBox terminal">
                    <div className="terminal-text">
                        Expected Output: XYZ
                        <br></br>
                        Your Output: XYZ
                    </div>
                    <div className="button-wrapper">
                        <div className="collab-buttons" >
                            Lock & Run
                        </div>
                    </div>
                </div>
            </div>

            <div className="collab-containers chat">
                {/* <div className="collabBox chat">Chat</div> */}
            </div>

        </div>
=======
        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(
            import.meta.env.VITE_COLLAB_WS_URL || "ws://localhost:1234",
            sessionId,
            ydoc
        );

        provider.awareness.setLocalStateField("user", {
            name: localStorage.getItem("username") || "User",
            color:
                "#" +
                Math.floor(Math.random() * 0xffffff)
                    .toString(16)
                    .padStart(6, "0"),
        });

        const handleAwarenessChange = () => {
            const states = [...provider.awareness.getStates().values()];
            setPartnerOnline(states.length > 1);
        };

        provider.awareness.on("change", handleAwarenessChange);
        handleAwarenessChange();

        ydocRef.current = ydoc;
        providerRef.current = provider;

        return () => {
            provider.awareness.off("change", handleAwarenessChange);
            provider.destroy();
            ydoc.destroy();
        };
    }, [sessionId]);

    const question = JSON.parse(sessionStorage.getItem("question"));
    const resolvedQuestionId =
        questionId || question?.id || question?.question_id || question?._id;

    console.log("session question:", question);
    console.log("prop questionId:", questionId);
    console.log("resolvedQuestionId:", resolvedQuestionId);

    const handleSubmitCode = () => {
        setShowReviewStats(true);
    };

    return (
        <>
            <div className="collaboration-main-container">
                <CodingQuestion question={question} />

                <Coding
                    onSubmitCode={handleSubmitCode}
                    ydoc={ydocRef.current}
                    provider={providerRef.current}
                    questionId={questionId}
                />

                <Chat
                    sessionId={sessionId}
                    provider={providerRef.current}
                    partnerOnline={partnerOnline}
                />
            </div>

            {showReviewStats && (
                <ReviewStats
                    question={question}
                    onExitCollab={onExitCollab}
                />
            )}
        </>
>>>>>>> Stashed changes
    );
}

export default CollaborationPage;