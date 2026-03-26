import axios from "axios";

const QUESTION_GATEWAY = "http://localhost:5000/questions"

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