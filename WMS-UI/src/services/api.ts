import axios from "axios";
import {useAuthStore} from "@/stores/authStore.ts"; // 导入 Pinia store

const API_BASE_URL = "http://localhost:8080";

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

        if (token) {
            console.log('请求拦截器', token);
            config.headers.authorization = `Bearer ${token}`;
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

export const getRequest = (url: string, data: object) => request("get", url, data);
export const postRequest = (url: string, data: object) => request("post", url, data);
export const putRequest = (url: string, data: object) => request("put", url, data);
export const deleteRequest = (url: string) => request("delete", url);

export const getCaptchaImage = async (): Promise<string> => {
    try {
        const response = await api.get('/authorization/captcha', {
            responseType: 'arraybuffer', // 获取字节流
        });

        // 将字节流转换为 Blob 对象
        const blob = new Blob([response.data], {type: 'image/png'});

        // 生成一个 URL 供 img 标签使用
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("获取验证码失败:", error);
        throw error; // 抛出错误，便于调用者处理
    }
};
