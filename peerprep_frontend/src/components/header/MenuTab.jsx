function MenuTab({...menuTabArgs}) {
    const { setShowAboutUs,setShowHowToPlay, setShowQuestions } = menuTabArgs;

    const handleAboutClick = () => {
        setShowAboutUs((prev) => !prev);
        setShowHowToPlay(false);
        setShowQuestions(false);
    };

    const handleHowToPlayClick = () => {
        setShowAboutUs(false);
        setShowHowToPlay((prev) => !prev);
        setShowQuestions(false);
    };

    const handleQuestionsClick = () => {
        setShowAboutUs(false);
        setShowHowToPlay(false);
        setShowQuestions((prev) => !prev);
    };


    return (
        <div className='button-group'>
            <div className='button' onClick={handleAboutClick}>About</div>
            <div className='button' onClick={handleHowToPlayClick}>How to Play</div>
            <div className='button' onClick={handleQuestionsClick}>Questions</div>
        </div>
    );
}

export default MenuTab;