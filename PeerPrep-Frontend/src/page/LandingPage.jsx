import React, { useState } from "react";
import './LandingPage.css';
import Header from '../components/header/Header'
import Hero from "../components/hero/Hero";
import Footer from "../components/footer/Footer";

function LandingPage() {
    const[isLoggedIn, setLoggedIn] = useState(false);

    return (
        <div className='background-container'>
            
            <Header isLoggedIn ={isLoggedIn} setLoggedIn = {setLoggedIn}/>

            <Hero/>
            
            <Footer />
        </div>
    );
}

export default LandingPage;