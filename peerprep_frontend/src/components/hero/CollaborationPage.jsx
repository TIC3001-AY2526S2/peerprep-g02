import React, { useState, useEffect, useRef } from "react";
import Chat from "./Chat";
import Coding from "./Coding";
import CodingQuestion from "./CodingQuestion";
import CollaborationHeader from "../header/CollaborationHeader";
import './CollaborationPage.css';
import ReviewStats from "../popups/ReviewStats";
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { setup, run } from '../../api/CollabApi';
import { getStarterCode } from '../../api/QuestionApi';
import { connectSubmitSocket, submitCode, closeSubmitSocket } from "../../hook/submitSocket";

function CollaborationPage({ sessionId, topic, difficulty, onExitCollab }) {
    const TOTAL_TIME = 120;

    const [showReviewStats, setShowReviewStats] = useState(false);
    const [partnerOnline, setPartnerOnline] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
    const [isTimerStopped, setIsTimerStopped] = useState(false);
    const [question, setQuestion] = useState(null);
    const [skeleton, setSkeleton] = useState("");
    const [waiting, setWaiting] = useState(false);

    const ydocRef = useRef(null);
    const providerRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!sessionId) return;

        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(
            import.meta.env.VITE_COLLAB_WS_URL || 'ws://localhost:1234',
            sessionId,
            ydoc
        );

        provider.awareness.setLocalStateField('user', {
            name: localStorage.getItem('username') || 'User',
            color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')
        });

        provider.awareness.on('change', () => {
            const states = [...provider.awareness.getStates().values()];
            setPartnerOnline(states.length > 1);
        });

        ydocRef.current = ydoc;
        providerRef.current = provider;

        return () => {
            provider.destroy();
            ydoc.destroy();
        };
    }, [sessionId]);

    useEffect(() => {
        const q = localStorage.getItem("question");
        if (q) setQuestion(JSON.parse(q));
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
                //open prompt to ask for submit
                console.log("Peer submitted");
            },

            onBothSubmitted: () => {
                console.log("Both submitted");

                setWaiting(false);
                setIsTimerStopped(true);
                setShowReviewStats(true);
            },

            onPeerDisconnected: () => {
                //open prompt to notify user
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
            setSkeleton(code);
        };
        fetchSkeleton();
    }, [question]);

    const handleTimeUp = () => {
        setIsTimerStopped(true);
        setShowReviewStats(true);
    };


    const handleSubmitCode = async () => {
        setWaiting(true);
        submitCode();
        setIsTimerStopped(true);
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

                {question && <Coding
                    onSubmitCode={handleSubmitCode}
                    ydoc={ydocRef.current}
                    provider={providerRef.current}
                    skeleton={skeleton}
                />}

                <Chat
                    partnerOnline={partnerOnline}
                    sessionId={sessionId}
                    provider={providerRef.current}
                />
            </div>

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