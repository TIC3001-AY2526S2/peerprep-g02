import "./reviewStats.css";
import logo from "../../assets/images/logo.jpg";

function ReviewStats({ question, onExitCollab, timeLeft, totalTime }) {
    const timeTaken = totalTime - timeLeft;

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes} Mins ${seconds} Secs`;
    };

    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <img src={logo} alt="Logo" className="matching-profile-image" />
                <div>
                    <h2>Prep Complete!</h2>
                    <p>Time Taken: {formatTime(timeTaken)}</p>
                    <p>Question: {question.title}</p>
                    <p>Topic: {question.categories.join(", ")}</p>
                    <p>Difficulty: {question.complexity}</p>
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