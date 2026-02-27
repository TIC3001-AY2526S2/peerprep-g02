import React, {useState} from "react";
import DropdownContainer from "./DropdownContainer";

function Hero(){
    //dropdown stuff
    const [selectedDifficulty, setSelectedDifficulty] = useState();
    const [selectedTopic, setSelectedTopic] = useState();
    const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];
    const topicOptions = ["Array", "Hash Table", "List", "String", "Tree"];

    const start = (e) => {
        e.preventDefault();
        console.log("start")
    }

    return(
        <div className="hero-section-wrapper">
                <div className="findmatch-container">
                    <div className="findamatch-fontstyle">Find a Match!</div>
                    <div className="topic-difficulty-container">

                        <DropdownContainer label ={"Topic"} options={topicOptions} selected={selectedTopic} setSelected={setSelectedTopic}/>

                        <DropdownContainer label = {"Difficulty"} options={difficultyOptions} selected={selectedDifficulty} setSelected={setSelectedDifficulty}/>

                    </div>
                    <div className="lets-go-wrapper">
                        <div className='letsgo-button' onClick={(e)=>start(e)}>Let's Go</div>
                    </div>
                </div>
            </div>
    );
}

export default Hero;