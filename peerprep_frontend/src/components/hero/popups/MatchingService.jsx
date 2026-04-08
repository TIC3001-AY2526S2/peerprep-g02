import { useEffect, useState } from 'react';
import logo from '../../../assets/images/logo.jpg';
import './matchingService.css';

function MatchingService() {

    return (
        <div className='page-container'>
            <div className='matching-service-container'>
                <div className='topic-difficulty-font'>
                    Topic: XXX
                    <br></br>Difficulty: XXX
                </div>
                <div className='countdown-container'>
                    <img src={logo} alt="Logo" className="matching-profile-image" />
                    <div className='findamatch-fontstyle'>Finding a Peer...
                        <br></br> 00:01
                    </div>
                    <img src={logo} alt="Logo" className="matching-profile-image" />
                </div>
                <div className="lets-go-wrapper">
                    <div className='letsgo-button'>Cancel</div>
                </div>
            </div>
        </div>
    );

}

export default MatchingService;