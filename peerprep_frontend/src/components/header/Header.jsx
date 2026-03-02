import LoginSignupOptions from "./LoginSignupOptions";
import MenuTab from "./MenuTab";
import './header.css';


function Header({...headerArgs}) {
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
    return (
        <div className='header-container'>
            <div className='logo'>PeerPrep</div>
            <MenuTab {...menuTabArgs} />
            <LoginSignupOptions {...loginSignupArgs} />
        </div>
    );
}

export default Header;