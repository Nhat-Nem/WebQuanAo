import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5050/api",
    withCredentials: true
})

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