import LoginSignup from "./LoginSignup";
import MenuTab from "./MenuTab";


function Header(isLoggedIn) {

    return (
        <div className='header-container'>
            <div className='logo'>PeerPrep</div>
            <MenuTab />
            <LoginSignup isLoggedIn={isLoggedIn} />
        </div>
    );
}

export default Header;