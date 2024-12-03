import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const postRequest = async (url: string, data: object) => {
    try{
        return await axios.post(`${API_BASE_URL}${url}`, data, {
            withCredentials: true,
        });

    } catch (error) {
        throw error;
    }
}