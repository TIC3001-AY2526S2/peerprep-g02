import logo from '../../assets/images/logo.jpg';
import { useUser } from "../../context/UserContext";

function LoginSignupOptions({
                                setShowLogin,
                                setShowSignup,
                                setLoggedIn,
                                setShowProfile,
                                setShowAboutUs,
                                setShowHowToPlay,
                                setShowQuestions
                            }) {
    const { user, logout } = useUser()
    const handleShowLogin = () => {
        setShowLogin((prev) => !prev);
        setShowSignup(false); // Ensure signup hidden when login shown
    }

    const handleShowSignup = () => {
        setShowSignup((prev) => !prev);
        setShowLogin(false); // Ensure login hidden when signup shown
    }

    const openProfile = () => {
        setShowProfile(true);
        setShowLogin(false);
        setShowSignup(false);

        setShowAboutUs(false);
        setShowHowToPlay(false);
        setShowQuestions(false);
        setShowLogin(false);
        setShowSignup(false);
    };

    return (
        <div className='button-group'>
            {!user && <>
                <div className='button' onClick={handleShowLogin}>Login</div>
                <div className='button' onClick={handleShowSignup}>Sign Up</div>
            </>}
            {user && <>
                <div className='button' onClick={openProfile}>Profile</div>
                <div className='button' onClick={() => { setLoggedIn(false); logout(); setShowProfile(false); }}>Log out</div>
                <p>{user.username}</p>
                <img src={logo} alt="Logo" className="profile-image" />
            </>
            }
        </div>
    )
}

export default LoginSignupOptions;
