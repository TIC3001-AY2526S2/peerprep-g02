import LoginSignupOptions from "./LoginSignupOptions";
import MenuTab from "./MenuTab";
import './header.css';

function Header({ ...headerArgs }) {
    const {
        isLoggedIn,
        setShowAboutUs,
        setShowHowToPlay,
        setShowQuestions,
        setShowLogin,
        setShowSignup,
        setLoggedIn,
        setShowProfile,
        isHeaderDisabled
    } = headerArgs;

    const menuTabArgs = {
        setShowAboutUs: setShowAboutUs,
        setShowHowToPlay: setShowHowToPlay,
        setShowQuestions: setShowQuestions,
        setShowProfile : setShowProfile
    }

    const loginSignupArgs = {
        isLoggedIn: isLoggedIn,
        setShowLogin: setShowLogin,
        setShowSignup: setShowSignup,
        setLoggedIn: setLoggedIn,
        setShowProfile: setShowProfile,
        setShowAboutUs: setShowAboutUs,
        setShowHowToPlay: setShowHowToPlay,
        setShowQuestions: setShowQuestions,
    }

    const reset = () => {
        setShowAboutUs(false);
        setShowHowToPlay(false);
        setShowLogin(false);
        setShowQuestions(false);
        setShowSignup(false);
        setShowProfile(false);
    }

    return (
        <div className={`header ${isHeaderDisabled ? "header-disabled" : ""}`}>
            <div className='header-container'>
                <div className='logo' onClick={reset}>PeerPrep</div>
                <MenuTab {...menuTabArgs} />
                <LoginSignupOptions {...loginSignupArgs} />
            </div>
        </div>
    );
}

export default Header;