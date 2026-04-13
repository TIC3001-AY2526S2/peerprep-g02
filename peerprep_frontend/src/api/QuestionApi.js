import axios from "axios";
import { SwitchCamera } from "lucide-react";

const QUESTION_GATEWAY = "http://localhost:8000/questions"

export const getTopics = async () => {
    try {
        const response = await axios.get(`${QUESTION_GATEWAY}/topics`);
        const topics = response.data.topics;
        return topics;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getRandomQuestion = async(topic, difficulty) =>{
    try{
        let complexity;
        switch(difficulty.toLowerCase()){
            case "beginner":
                complexity = "Easy"
                break;
            case "intermediate":
                complexity = "Medium";
                break;
            case "advanced":
                complexity = "Hard";
                break;
        }
        const response = await axios.get(`${QUESTION_GATEWAY}/fetchRandomQuestion/${topic}/${complexity}`);
        if (response.data){
            console.log(response.data);
            return response.data.question;
        }
    }catch(error){
        console.log(error);
        return {};
    }
}

export const getQuestions = async () => {
    try {
        const response = await axios.get(`${QUESTION_GATEWAY}/fetchQuestions`);
        const questions = response.data.questions;
        return questions;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const createQuestion = async (questionData) => {
    const token = sessionStorage.getItem("token");
    try {
        const response = await axios.post(`${QUESTION_GATEWAY}/newQuestion`, questionData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }); // Adjusted route
        return response.data;
    } catch (error) {
        console.error("Error creating question:", error);
        throw error;
    }
};

export const updateQuestion = async (id, questionData) => {
    const token = sessionStorage.getItem("token");
    try {
        const response = await axios.put(`${QUESTION_GATEWAY}/updateQuestion/${id}`, questionData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        console.error("Error updating question:", error);
        throw error;
    }
};

export const deleteQuestion = async (id) => {
    const token = sessionStorage.getItem("token");
    try {
        const response = await axios.delete(`${QUESTION_GATEWAY}/deleteQuestion/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        console.error("Error deleting question:", error);
        throw error;
    }
};