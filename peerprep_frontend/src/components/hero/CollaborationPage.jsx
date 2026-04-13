import React, { useState, useEffect, useRef } from "react";
import Chat from "./Chat";
import Coding from "./Coding";
import CodingQuestion from "./CodingQuestion";
import './CollaborationPage.css';
import ReviewStats from "../hero/popups/ReviewStats";
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';


function CollaborationPage({ sessionId, topic, difficulty, onExitCollab }) {
    const [showReviewStats, setShowReviewStats] = useState(false);
    const [partnerOnline, setPartnerOnline] = useState(false);
    const ydocRef = useRef(null);
    const providerRef = useRef(null);

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

    const question = sessionStorage.getItem("question")
    return (
        <>
            <div className="collaboration-main-container">
                <div className="partner-status-bar">
                    <span className={`partner-status ${partnerOnline ? 'online' : 'offline'}`}>
                        {partnerOnline ? '● Partner connected' : '○ Waiting for partner…'}
                    </span>
                </div>

                <CodingQuestion question={question} />

                <Coding
                    onSubmitCode={() => setShowReviewStats(true)}
                    ydoc={ydocRef.current}
                    provider={providerRef.current}
                />

                <Chat
                    sessionId={sessionId}
                    provider={providerRef.current}
                />
            </div>

            {showReviewStats && (
                <ReviewStats question={question} onExitCollab={onExitCollab} />
            )}
        </>
    );
}

export default CollaborationPage;