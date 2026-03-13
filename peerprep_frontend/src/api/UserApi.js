import axios from "axios";

const USER_GATEWAY = "http://localhost:5000/users";

export const loginUser = async (email, password, setLoggedIn) => {
    const data = { email, password };

    try {
        const response = await axios.post(`${USER_GATEWAY}/login`, data);
        const user = {"token": response.data.token, "username": response.data.username};
        return user;

    } catch (error) {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                alert("Incorrect password");
            } else if (status === 404) {
                alert("User not found");
            }
        } else {
            alert("Server not reachable.");
        }
        setLoggedIn(false);
        return false;
    }
};

export const signup = async (email, password, username) => {
    const data = { 
        "email": email,
        "password": password,
        "username": username };

    try {
        await axios.post(`${USER_GATEWAY}/register`, data);
        return true;

    } catch (error) {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                alert("Passwords do not match");
            } else if (status === 409) {
                alert("Username already exists");
            }
        } else {
            alert("Server not reachable.");
        }
        return false;
    }
};

