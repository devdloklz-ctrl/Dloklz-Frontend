import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5555",
    // baseURL: "https://dloklz-api.onrender.com",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;