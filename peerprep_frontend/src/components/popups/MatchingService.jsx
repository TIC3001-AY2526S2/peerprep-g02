import React, { useEffect, useState, useRef } from "react";
import logo from "../../assets/images/logo.jpg";
import "./matchingService.css";
import { getRandomQuestion } from "../../api/QuestionApi";

function MatchingService({ selectedTopic, selectedDifficulty, onClose, onConfirm }) {
    const [peerFound, setPeerFound] = useState(false);
    const [matchFailed, setMatchFailed] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5);
    const [elapsedTime, setElapsedTime] = useState(0);
    const socketRef = useRef(null);
    const peerFoundRef = useRef(false);
    const matchDataRef = useRef(null); // Server response

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
            }));
        };

        socketRef.current.onmessage = (msg) => {
            const data = JSON.parse(msg.data);
            console.log("PARSED:", data);

            if (data.status === "Match Found") {
                matchDataRef.current = data;
                peerFoundRef.current = true;
                setPeerFound(true);
                setMatchFailed(false);
                sessionStorage.setItem("room", JSON.stringify(data.match));
                const questionData = getQuestion(selectedTopic, selectedDifficulty);
                sessionStorage.setItem("question", JSON.stringify(questionData));
            } else if (data.status === "timeout") {
                setMatchFailed(true);
            }
        };

        socketRef.current.onerror = () => setMatchFailed(true);

        socketRef.current.onclose = (msg) => {
            console.log("CLOSED — code:", msg.code, "reason:", msg.reason);
            if (!peerFoundRef.current) setMatchFailed(true);
        };

        return () => socketRef.current?.close();
    }, []); // connect once, never reconnect

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

    // SessionId from match
    useEffect(() => {
        if (peerFound && timeLeft <= 0) {
            onConfirm(matchDataRef.current?.match?.roomId ?? null);
        }
    }, [peerFound, timeLeft, onConfirm]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };
    const getQuestion = async (topic, difficulty) => {
        try {
            const data = await getRandomQuestion(topic, difficulty);
            return data;
        } catch (err) {
            console.error("Failed to fetch question:", err);
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
                                ? "Peer Found!\nMatch Starting In"
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
                    {!peerFound && !matchFailed && (
                        <div className="letsgo-button" onClick={onClose}>
                            Cancel
                        </div>
                    )}

                    {matchFailed && (
                        <div className="letsgo-button" onClick={onClose}>
                            Close
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MatchingService;