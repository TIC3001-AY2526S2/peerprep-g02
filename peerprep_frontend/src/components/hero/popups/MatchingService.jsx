import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/logo.jpg";
import "./matchingService.css";

function MatchingService({ selectedTopic, selectedDifficulty, onClose, onConfirm }) {
    const [peerFound, setPeerFound] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30); //set countdown here
    const [elapsedTime, setElapsedTime] = useState(0); //timer start from 0

<<<<<<< Updated upstream
    // Before peer is found
=======

    // Socket connection
>>>>>>> Stashed changes
    useEffect(() => {
        if (peerFound) return;

        const interval = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);

<<<<<<< Updated upstream
=======
        socketRef.current.onopen = () => {
            socketRef.current.send(JSON.stringify({
                topic: selectedTopic,
                complexity: selectedDifficulty
            }));
        };

        socketRef.current.onmessage = async (msg) => {
            const data = JSON.parse(msg.data);
            console.log("PARSED:", data);

            if (data.status === "Match Found") {
                matchDataRef.current = data;
                peerFoundRef.current = true;
                setPeerFound(true);
                setMatchFailed(false);

                sessionStorage.setItem("room", JSON.stringify(data.match));

                try {
                    const questionData = await getQuestion(selectedTopic, selectedDifficulty);
                    sessionStorage.setItem("question", JSON.stringify(questionData));
                } catch (err) {
                    console.error("Failed to fetch question:", err);
                }

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
>>>>>>> Stashed changes
        return () => clearInterval(interval);
    }, [peerFound]);

    // Simulate peer found at 3 seconds
    useEffect(() => {
        if (elapsedTime === 3) {
            setPeerFound(true);
            setTimeLeft(30);
        }
    }, [elapsedTime]);

    // After peer is found
    useEffect(() => {
        if (!peerFound) return;

        if (timeLeft <= 0) {
            onClose();
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
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
                    Topic: {selectedTopic}
                    <br />
                    Difficulty: {selectedDifficulty}
                </div>

                <div className="countdown-container">
                    <img src={logo} alt="Logo" className="matching-profile-image" />

                    <div className="findamatch-fontstyle">
                        {peerFound ? "Peer Found!" : "Finding a Peer..."}
                        <br />
                        {peerFound ? formatTime(timeLeft) : formatTime(elapsedTime)}
                    </div>

                    <img src={logo} alt="Logo" className="matching-profile-image" />
                </div>

                <div className="lets-go-wrapper">
                    <div className="letsgo-button" onClick={handleButtonClick}>
                        {peerFound ? "Confirm" : "Cancel"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MatchingService;