import React, { useState } from "react";
import DropdownContainer from "./DropdownContainer";
import MatchingService from "./popups/MatchingService";

function FindMatch({ topicOptions, isLoggedIn, setShowCollaboration, showMatching, setShowMatching }) {
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");
    const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];

    const start = (e) => {
        e.preventDefault();
        if (isLoggedIn && selectedTopic && selectedDifficulty) {
            setShowMatching(true);
        }
    };

    const closeMatchingService = () => {
        setShowMatching(false);
    };

    if (showMatching) {
        return (
            <MatchingService
                selectedTopic={selectedTopic}
                selectedDifficulty={selectedDifficulty}
                onClose={closeMatchingService}
                onConfirm={() => {
                    setShowMatching(false);
                    setShowCollaboration(true);
                }}
            />
        );
    }

    return (
        <div className="findmatch-container">
            <div className="findamatch-fontstyle">Find a Match!</div>
            <div className="topic-difficulty-container">
                <DropdownContainer
                    label="Topic"
                    options={topicOptions}
                    selected={selectedTopic}
                    setSelected={setSelectedTopic}
                />
                <DropdownContainer
                    label="Difficulty"
                    options={difficultyOptions}
                    selected={selectedDifficulty}
                    setSelected={setSelectedDifficulty}
                />
            </div>
            <div className="lets-go-wrapper">
                <div className="letsgo-button" onClick={start}>
                    Let's Go
                </div>
            </div>
        </div>
    );
}

export default FindMatch;