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
    const [collabReady, setCollabReady] = useState(false);
    const ydocRef = useRef(null);
    const providerRef = useRef(null);

    useEffect(() => {
        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(
            process.env.REACT_APP_COLLAB_WS_URL || "ws://localhost:3000",
            sessionId,
            ydoc
        );

        ydocRef.current = ydoc;
        providerRef.current = provider;
        setCollabReady(true);

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

    if (!collabReady) return <div>Connecting...</div>;

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
    );
}

export default CollaborationPage;