import React, { useState } from "react";
import './HowToPlay.css';

function HowToPlay() {

    return (
            <div className="how-to-play-container">
                <div className="title-text">How to Play</div>
                <div className="text-group">
                    <div className="box">Step 1: Create Your Account</div>
                    Sign up and log in to access PeerPrep and begin your practice journey.
                    <div className="box">Step 2: Choose Your Challenge</div>
                    Select your preferred difficulty level — Easy, Medium, or Hard — and pick the topic you want to focus on for the session.
                    <div className="box">Step 3: Enter Matchmaking</div>
                    After confirming your selections, you’ll enter the queue. PeerPrep will search for another online user who has chosen the same difficulty and topic.
                    <div className="box">Step 4: Wait for a Match</div>
                    If a suitable match is found, the session begins immediately. If no match is found within the waiting period, the session will time out and you can try again or adjust your selections.
                    <div className="box">Step 5: Collaborate in Real Time</div>
                    Once matched, both users receive a curated interview-style question and enter a shared collaborative coding space. Work together to analyze the problem, discuss strategies, and build your solution.
                    <div className="box">Step 6: End the Session</div>
                    When you’re done, either user can gracefully terminate the collaborative session.
                    <div className="box">Step 7: Play Again</div>
                    Queue up for another challenge anytime to continue improving your technical interview skills.
                </div>
            </div>
    );
}

export default HowToPlay;