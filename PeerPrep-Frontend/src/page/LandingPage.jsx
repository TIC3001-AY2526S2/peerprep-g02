import React, { useState } from "react";
import './LandingPage.css';
import logo from '../assets/images/logo.jpg';
import { ChevronDown } from "lucide-react";

function LandingPage() {
    // dropdown stuff
    const [selectedTopic, setSelectedTopic] = useState("Select Topic");
    const [selectedDifficulty, setSelectedDifficulty] = useState("Select Difficulty");
    const topicOptions = ["Array", "Hash Table", "List", "String", "Tree"];
    const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];

    return (
        <div className='background-container'>
            {/* HEADER */}
            <div className='header-container'>
                <div className='logo'>PeerPrep</div>
                <div className='button-group'>
                    <div className='button'>About</div>
                    <div className='button'>How to Play</div>
                    <div className='button'>Topic</div>
                </div>
                <div className='login-group'>
                    <div className='button'>Login</div>
                    <div className='button'>Sign Up</div>
                    <img src={logo} alt="Logo" className="profile-image" />
                </div>
            </div>

            {/* HERO */}
            <div className="hero-section-wrapper">
                <div className="findmatch-container">
                    <div className="findamatch-fontstyle">Find a Match!</div>
                    <div className="topic-difficulty-container">
                        {/* Topic Dropdown */}
                        <div className="topic-difficulty-box">
                            <div className="topic-difficulty-font">Topic</div>
                            <div className="dropdown">
                                <button className="dropdown-button">{selectedTopic}
                                    <ChevronDown size={18} className="dropdown-icon" />
                                </button>
                                <div className="dropdown-content">
                                    {topicOptions.map(option => (
                                        <div
                                            key={option}
                                            className="dropdown-item"
                                            onClick={() => setSelectedTopic(option)}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="topic-difficulty-box">
                            <div className="topic-difficulty-font">Difficulty</div>
                            <div className="dropdown">
                                <button className="dropdown-button">{selectedDifficulty}
                                    <ChevronDown size={18} className="dropdown-icon" />
                                </button>
                                <div className="dropdown-content">
                                    {difficultyOptions.map(option => (
                                        <div
                                            key={option}
                                            className="dropdown-item"
                                            onClick={() => setSelectedDifficulty(option)}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lets-go-wrapper">
                        <div className='letsgo-button'>Let's Go</div>
                    </div>
                </div>
            </div>
            <div className="lets-go-wrapper">
                Proud product of Group 2 TIC3001/TCX3225
            </div>
        </div>
    );
}

export default LandingPage;