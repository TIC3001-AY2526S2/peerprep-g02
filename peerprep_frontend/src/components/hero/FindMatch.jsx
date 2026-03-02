import React, {useEffect, useState} from "react";
import DropdownContainer from "./DropdownContainer";
import { getTopics } from "../../api/QuestionApi";

function FindMatch() {
    //dropdown stuff
    const [selectedDifficulty, setSelectedDifficulty] = useState();
    const [selectedTopic, setSelectedTopic] = useState();
    const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];
    const [topicOptions,setTopicOptions] = useState([]);
    
    useEffect(()=>{
        get_topics(setTopicOptions);
    },[]);

    const start = (e) => {
        e.preventDefault();
        console.log("start")
    }

    const get_topics = async (setTopicOptions)=>{
        const topics = await getTopics();
        setTopicOptions(topics)
    }

    return (
        <div className="findmatch-container">
            <div className="findamatch-fontstyle">Find a Match!</div>
            <div className="topic-difficulty-container">

                <DropdownContainer label={"Topic"} options={topicOptions} selected={selectedTopic} setSelected={setSelectedTopic} />

                <DropdownContainer label={"Difficulty"} options={difficultyOptions} selected={selectedDifficulty} setSelected={setSelectedDifficulty} />

            </div>
            <div className="lets-go-wrapper">
                <div className='letsgo-button' onClick={(e) => start(e)}>Let's Go</div>
            </div>
        </div>
    );
}

export default FindMatch;