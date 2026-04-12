import React, { useEffect, useState, useRef } from "react";
import logo from "../../../assets/images/logo.jpg";
import "./matchingService.css";

function MatchingService({ selectedTopic, selectedDifficulty, onClose, onConfirm }) {
    const [peerFound, setPeerFound] = useState(false);
    const [matchFailed, setMatchFailed] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [elapsedTime, setElapsedTime] = useState(0);
    const socketRef = useRef(null);
    const peerFoundRef = useRef(false);

    // Socket connection
    useEffect(() => {
        console.log("WebSocket mounting, topic:", selectedTopic, "difficulty:", selectedDifficulty);
        if (socketRef.current) return;

        const token = sessionStorage.getItem("token");
        const wsUrl = `ws://localhost:8000/matching/?token=${token}`;
        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onopen = () => {
            socketRef.current.send(JSON.stringify({
                topic: selectedTopic,
                complexity: selectedDifficulty
            }))
        };
        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            if (data.status === "MATCH_SUCCESS") {
                peerFoundRef.current = true;
                setPeerFound(true);
                setTimeLeft(30);
                setMatchFailed(false);
            } else if (data.type === "MATCH_FAIL") {
                setMatchFailed(true);
            }
        };

        socketRef.current.onerror = () => setMatchFailed(true);

        socketRef.current.onclose = () => {
            if (!peerFoundRef.current) setMatchFailed(true);
        };

        return () => socketRef.current?.close();
    }, [selectedTopic, selectedDifficulty]);

    // Elapsed time search
    useEffect(() => {
        if (peerFound || matchFailed) return;
        const interval = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
        return () => clearInterval(interval);
    }, [peerFound, matchFailed]);

    // Countdown after found
    useEffect(() => {
        if (!peerFound || timeLeft <= 0) return;
        const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [peerFound, timeLeft]);

    // Auto-close
    useEffect(() => {
        if (peerFound && timeLeft <= 0) onClose();
    }, [peerFound, timeLeft, onClose]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleButtonClick = () => {
        if (peerFound) {
            onConfirm();
        } else {
            onClose();
        }
    };

    return (
        <div className="page-container">
            <div className="matching-service-container">
                <div className="topic-difficulty-font">
                    Topic: {selectedTopic} | Difficulty: {selectedDifficulty}
                </div>

                <div className="countdown-container">
                    <img src={logo} alt="Logo" className="matching-profile-image" />
                    <div className="findamatch-fontstyle">
                        {matchFailed
                            ? "No Match Found"
                            : peerFound
                                ? "Peer Found!"
                                : "Finding a Peer..."}
                        <br />
                        {matchFailed
                            ? "Try again later"
                            : peerFound
                                ? formatTime(timeLeft)
                                : formatTime(elapsedTime)}
                    </div>
                    <img src={logo} alt="Logo" className="matching-profile-image" />
                </div>

                <div className="lets-go-wrapper">
                    {matchFailed ? (
                        <div className="letsgo-button" onClick={onClose}>
                            Close
                        </div>
                    ) : (
                        <div className="letsgo-button" onClick={handleButtonClick}>
                            {peerFound ? "Confirm" : "Cancel"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MatchingService;