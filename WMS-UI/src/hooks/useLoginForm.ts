import type {FormData} from "@/types/formData";
import {reactive} from "vue";
import {postRequest} from "@/services/api.ts";

export default function useLoginForm() {
    const loginForm = reactive<FormData>({
        userName: "",
        password: "",
        role: "information_manager",
        status: 0
    })

    const submitLoginForm = async () => {
        try{
            const response = await postRequest('/auth/login', loginForm);
            console.log(response);

            if(response.status == 200 && response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
        } catch (error) {
            console.log('登录失败！', error);
        }
    }

    return {
        loginForm,
        submitLoginForm
    }
}