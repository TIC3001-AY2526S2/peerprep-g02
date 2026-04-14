import './header.css';
import logo from '../../assets/images/logo.jpg';
import { useUser } from "../../context/UserContext";
import { useState, useEffect } from "react";

function CollaborationHeader({
    timeLeft,
    setTimeLeft,
    onTimeUp,
    onOneMinuteLeft,
    isTimerStopped
}) {
    const { user } = useUser();
    const [oneMinuteWarned, setOneMinuteWarned] = useState(false);

    useEffect(() => {
        if (isTimerStopped) return;

        if (timeLeft <= 0) {
            onTimeUp?.();
            return;
        }

        if (timeLeft === 60 && !oneMinuteWarned) {
            onOneMinuteLeft?.();
            setOneMinuteWarned(true);
        }

        const timer = setTimeout(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, setTimeLeft, onTimeUp, onOneMinuteLeft, oneMinuteWarned, isTimerStopped]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className='header-container'>
            <div className='logo'>PeerPrep</div>
            <div className={`timer ${timeLeft <= 60 ? 'timer-warning' : ''}`}>
                Time Left: {formatTime(timeLeft)}
            </div>
            <div className='profile-container'>
                <div>{user.username}</div>
                <img src={logo} alt="Logo" className="profile-image" />
            </div>
        </div>
    );
}

export default CollaborationHeader;