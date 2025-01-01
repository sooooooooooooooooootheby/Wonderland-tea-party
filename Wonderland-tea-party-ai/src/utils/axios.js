import axios from "axios";

// 创建 Axios 实例
const Axios = axios.create({
    baseURL: "https://api.sooooooooooooooooootheby.top/ai/",
});

// 请求拦截器
Axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
Axios.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            console.error("Error:", error.response);
        } else {
            console.error("Network Error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default Axios;
