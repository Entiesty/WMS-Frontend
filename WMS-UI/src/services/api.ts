import axios from "axios";
import {useAuthStore} from "@/stores/authStore.ts"; // 导入 Pinia store

const API_BASE_URL = "http://localhost:8080";
const publicUrls = ['/authorization/login', '/authorization/register'];

// 创建一个 axios 实例
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 设置超时时间
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const token = authStore.token; // 从 Pinia store 获取 token

        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        console.log('拦截器错误', error);
        return Promise.reject(error);
    }
);
const request = async (method: "get" | "post" | "put" | "delete", url: string, data?: object) => {
    try {
        return await api.request({
            method,
            url,
            data,
        });
    } catch (error) {
        throw error;
    }
};

export const getRequest = (url: string) => request("get", url);
export const postRequest = (url: string, data: object) => request("post", url, data);
export const putRequest = (url: string, data: object) => request("put", url, data);
export const deleteRequest = (url: string) => request("delete", url);
