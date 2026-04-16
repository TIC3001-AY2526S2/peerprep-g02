import DropdownContainer from "./DropdownContainer";

function FindMatch({ selectedDifficulty, selectedTopic, setSelectedDifficulty, setSelectedTopic, topicOptions, isLoggedIn, setShowCollaboration, showMatching, setShowMatching, setShowLogin }) {
    const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];

    const start = (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            setShowLogin(true);
            return;
        }

        if (selectedTopic && selectedDifficulty) {
            setShowMatching(true);
        }

        if (!selectedTopic || !selectedDifficulty) {
            alert("Please select a topic and difficulty!");
            return;
        }
    };

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