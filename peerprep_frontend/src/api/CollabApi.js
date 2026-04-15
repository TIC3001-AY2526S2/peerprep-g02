import axios from "axios";

const RUN_CODE_GATEWAY = "http://localhost:8006"

export const setup = async (question) => {
    try {
        const payload = {
            "run_code": question["run_code"]
        }
        console.log(payload)
        console.log(question)
        const response = await axios.post(`${RUN_CODE_GATEWAY}/setup`, payload);
        if (response.status !== 200) {
            throw new Error("setup error");
        }
        console.log("setup complete");
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const run = async (userCode, expected_output) => {
    try {
        const payload = {
            "userCode": "def reverseString(s):\n    s.reverse()\n",
            "expected_output": "o l l e h",
            "input": "h e l l o"
        }

        const response = await axios.post(`${RUN_CODE_GATEWAY}/run`, payload);
        console.log(response);
        if (response.data) {
            console.log(response.data);
            return response.data;
        }
    } catch (error) {
        console.log(error);
        return {};
    }
}