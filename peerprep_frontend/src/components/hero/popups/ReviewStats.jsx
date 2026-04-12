import React from "react";
import "./reviewStats.css";
import logo from "../../../assets/images/logo.jpg";

function ReviewStats({ onExitCollab }) {
    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <img src={logo} alt="Logo" className="matching-profile-image" />
                <div>
                    <h2>Prep Complete!</h2>
                    <p>Time Taken: 04 Mins 30 Secs</p>
                    <p>Question: Add Binary</p>
                    <p>Topic: Arrays</p>
                    <p>Difficulty: Beginner</p>
                    <div className="home-button" onClick={onExitCollab}>
                        Back to Home
                    </div>
                </div>
                <img src={logo} alt="Logo" className="matching-profile-image" />
            </div>
        </div>
    );
}

export default ReviewStats;