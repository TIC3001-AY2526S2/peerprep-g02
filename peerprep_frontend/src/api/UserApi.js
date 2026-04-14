import axios from "axios";

const USER_GATEWAY = "http://localhost:8000/users";

export const loginUser = async (email, password) => {
    const data = { email, password };
    try {
        const response = await axios.post(`${USER_GATEWAY}/login`, data);
        return { token: response.data.token, user: response.data.user };
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            if (status === 401) alert("Incorrect password");
            else if (status === 404) alert("User not found");
        } else {
            alert("Server not reachable.");
        }
        return false;
    }
};

export const signup = async (email, password, username) => {
    const data = { email, password, username };
    try {
        await axios.post(`${USER_GATEWAY}/register`, data);
        return true;
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            if (status === 401) alert("Passwords do not match");
            else if (status === 409) alert("Username already exists");
        } else {
            alert("Server not reachable.");
        }
        return false;
    }
};

export const getUser = async (userId) => {
    try {
        const response = await axios.get(`${USER_GATEWAY}/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};