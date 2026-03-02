import axios from "axios";

const QUESTION_GATEWAY = "http://localhost:5000/questions"

export const getTopics = async () => {
    try {
        const response = await axios.get(`${QUESTION_GATEWAY}/topics`);
        const topics = response.data.topics;
        return topics;
    }catch(error){
        console.log(error);
        return [];
    }
}

export const getQuestions = async () => {
    try {
        const response = await axios.get(`${QUESTION_GATEWAY}/fetchQuestions`);
        const questions = response.data.questions;
        return questions;
    }catch(error){
        console.log(error);
        return [];
    }
}