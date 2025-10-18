import axios from "axios";

const api = axios.create({
    // baseURL: "http://localhost:5555",
    baseURL: "https://temp-plugin-for-wp.onrender.com",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;