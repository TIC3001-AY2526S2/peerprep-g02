import axios from "axios";

const USER_GATEWAY = "http://localhost:8000/users";

const handleError = (error) => {
    if (error.response) {
        const status = error.response.status;

        if (status === 401) {
            alert("Unauthorized. Please login again.");
        } else if (status === 404) {
            alert("Not found.");
        } else if (status === 400) {
            alert(error.response.data.detail || "Bad request");
        } else {
            alert("Request failed");
        }
    } else {
        alert("Server not reachable.");
    }
};

export const loginUser = async (email, password) => {
    const data = { email, password };

    try {
        const response = await axios.post(`${USER_GATEWAY}/login`, data);
        const user = { "token": response.data.token, "user": response.data.user };
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
        return false;
    }
};

export const signup = async (email, password, username) => {
    const data = {
        "email": email,
        "password": password,
        "username": username
    };

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

export const getUser = async(user_id) =>{
    try {
        const response = await axios.get(`${USER_GATEWAY}/user/${user_id}`);
        return response.data;

    } catch (error) {
        if (error.response) {
            const status = error.response.status;

            if (status === 404) {
                console.error("User not found");
            }
        } else {
            alert("Server not reachable.");
        }
        return {}
    }
}

export const getProfile = async (token) => {
    try {
        const res = await axios.get(`${USER_GATEWAY}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

export const updateProfile = async (token, payload) => {
    try {
        const res = await axios.put(`${USER_GATEWAY}/profile`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};