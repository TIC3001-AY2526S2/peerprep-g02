import './header.css';
import logo from '../../assets/images/logo.jpg';
import { useUser } from "../../context/UserContext";
import { useState, useEffect } from "react";

function CollaborationHeader() {
    const { user } = useUser()
    const [timeLeft, setTimeLeft] = useState(300);

    // Countdown
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setTimeout(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };
    return (
        <div className='header-container'>
            <div className='logo'>PeerPrep</div>
            <div>Time Left: {formatTime(timeLeft)}</div>
            <div className='profile-container'>
                {/* <p>{user.username}</p> */}
                <img src={logo} alt="Logo" className="profile-image" />
            </div>
        </div>
    );
}

export default CollaborationHeader;