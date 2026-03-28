import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API,
    withCredentials: true
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token"); // lấy từ localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    res => res,
    err => {

        if (err.response?.status === 401 && 
            !err.config.url.includes("/auth/me")) {
            console.log("Not authenticated")
        }

        return Promise.reject(err)
    }
)

export default api;