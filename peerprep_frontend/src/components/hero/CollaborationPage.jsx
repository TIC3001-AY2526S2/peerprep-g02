import React, { useState, useEffect, useRef } from "react";
import Chat from "./Chat";
import Coding from "./Coding";
import CodingQuestion from "./CodingQuestion";
import CollaborationHeader from "../header/CollaborationHeader";
import ReviewStats from "../popups/ReviewStats";
import Waiting from "../popups/Waiting";
import "./CollaborationPage.css";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { setup } from "../../api/CollabApi";
import { getStarterCode } from "../../api/QuestionApi";
import {
    connectSubmitSocket,
    submitCode,
    closeSubmitSocket
} from "../../hook/submitSocket";

function CollaborationPage({ sessionId, topic, difficulty, onExitCollab }) {
    const TOTAL_TIME = 120;

    const [showReviewStats, setShowReviewStats] = useState(false);
    const [partnerOnline, setPartnerOnline] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
    const [isTimerStopped, setIsTimerStopped] = useState(false);
    const [question, setQuestion] = useState(null);
    const [skeleton, setSkeleton] = useState("");
    const [waiting, setWaiting] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [otherSubmitted, setOtherSubmitted] = useState(false);

    const ydocRef = useRef(null);
    const providerRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!sessionId) return;

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
                    .padStart(6, "0")
        });

        const handleAwarenessChange = () => {
            const states = [...provider.awareness.getStates().values()];
            setPartnerOnline(states.length > 1);
        };

        provider.awareness.on("change", handleAwarenessChange);

        ydocRef.current = ydoc;
        providerRef.current = provider;

        return () => {
            provider.awareness.off("change", handleAwarenessChange);
            provider.destroy();
            ydoc.destroy();
            ydocRef.current = null;
            providerRef.current = null;
        };
    }, [sessionId]);

    useEffect(() => {
        const q = localStorage.getItem("question");
        if (q) {
            setQuestion(JSON.parse(q));
        }
    }, []);

    useEffect(() => {
        const roomRaw = sessionStorage.getItem("room");
        const userRaw = sessionStorage.getItem("user");

        if (!roomRaw || !userRaw) return;

        const room = JSON.parse(roomRaw);
        const user = JSON.parse(userRaw);

        const socket = connectSubmitSocket({
            room_id: room.roomId,
            user_id: user.user_id,

            onPeerSubmitted: () => {
                console.log("Peer submitted");
                setOtherSubmitted(true);
            },

            onBothSubmitted: () => {
                console.log("Both submitted");
                setOtherSubmitted(true);
                setWaiting(false);
                setIsTimerStopped(true);
                setShowReviewStats(true);
            },

            onPeerDisconnected: () => {
                console.log("Peer left");
            }
        });

        socketRef.current = socket;

        return () => {
            closeSubmitSocket();
            socketRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!question) return;

        setup(question);

        const fetchSkeleton = async () => {
            const code = await getStarterCode(question.title);
            setSkeleton(code || "");
        };

        fetchSkeleton();
    }, [question]);

    const handleTimeUp = () => {
        setIsTimerStopped(true);
        setWaiting(false);
        setShowReviewStats(true);
    };

    const handleSubmitCode = async () => {
        if (hasSubmitted) return;

        setHasSubmitted(true);
        setWaiting(true);
        setIsTimerStopped(true);

        try {
            submitCode();
        } catch (error) {
            console.error("Submit failed:", error);
        }
    };

    return (
        <>
            <CollaborationHeader
                timeLeft={timeLeft}
                setTimeLeft={setTimeLeft}
                onTimeUp={handleTimeUp}
                isTimerStopped={isTimerStopped}
            />

            <div className="collaboration-main-container">
                {question && <CodingQuestion question={question} />}

                {question && (
                    <Coding
                        onSubmitCode={handleSubmitCode}
                        ydoc={ydocRef.current}
                        provider={providerRef.current}
                        skeleton={skeleton}
                    />
                )}

                <Chat
                    partnerOnline={partnerOnline}
                    sessionId={sessionId}
                    provider={providerRef.current}
                />
            </div>

            {waiting && !showReviewStats && (
                <Waiting otherSubmitted={otherSubmitted} />
            )}

            {showReviewStats && (
                <ReviewStats
                    question={question}
                    onExitCollab={onExitCollab}
                    timeLeft={timeLeft}
                    totalTime={TOTAL_TIME}
                />
            )}
        </>
    );
}

export default CollaborationPage;