import LoginSignupOptions from "./LoginSignupOptions";
import MenuTab from "./MenuTab";
import './header.css';


function Header({ isDisabled, ...headerArgs }) {
    const { isLoggedIn, setShowAboutUs, setShowHowToPlay, setShowQuestions, setShowLogin, setShowSignup } = headerArgs;

    const menuTabArgs = {
        setShowAboutUs: setShowAboutUs,
        setShowHowToPlay: setShowHowToPlay,
        setShowQuestions: setShowQuestions
    }

    const loginSignupArgs = {
        isLoggedIn: isLoggedIn,
        setShowLogin: setShowLogin,
        setShowSignup: setShowSignup
    }

    const reset = () => {
        setShowAboutUs(false);
        setShowHowToPlay(false);
        setShowLogin(false);
        setShowQuestions(false);
        setShowSignup(false);
    }

    return (
        <div className={`header ${isDisabled ? "header-disabled" : ""}`}>
            <div className='header-container'>
                <div className='logo' onClick={reset}>PeerPrep</div>
                <MenuTab {...menuTabArgs} />
                <LoginSignupOptions {...loginSignupArgs} />
            </div>
        </div>
    );
}

export default Header;