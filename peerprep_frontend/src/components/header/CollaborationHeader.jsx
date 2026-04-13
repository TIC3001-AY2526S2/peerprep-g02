import { useEffect, useState } from "react";
import './header.css';
import logo from '../../assets/images/logo.jpg';
import { useUser } from "../../context/UserContext";

function CollaborationHeader() {
    const { user } = useUser();
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className='header-container'>
            <div className='logo'>PeerPrep</div>
            <div>Time Elapsed: {formatTime(timeElapsed)}</div>
            <div className='profile-container'>
                <p>{user?.username}</p>
                <img src={logo} alt="Logo" className="profile-image" />
            </div>
        </div>
    );
}

export default CollaborationHeader;