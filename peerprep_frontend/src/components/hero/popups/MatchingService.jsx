import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/logo.jpg";
import "./matchingService.css";

function MatchingService({ selectedTopic, selectedDifficulty, onClose, onConfirm }) {
    const [peerFound, setPeerFound] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30); //set countdown here
    const [elapsedTime, setElapsedTime] = useState(0); //timer start from 0

    // Before peer is found
    useEffect(() => {
        if (peerFound) return;

        const interval = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);

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
                    <div className='letsgo-button' onClick={(e)=>findMatch(e)}>Cancel</div>
                    <div className="letsgo-button" onClick={handleButtonClick}>
                        {peerFound ? "Confirm" : "Cancel"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MatchingService;