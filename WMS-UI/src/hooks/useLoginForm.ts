import type {FormData} from "@/types/formData";
import {reactive, ref} from "vue";
import {postRequest} from "@/services/api.ts";

export default function useLoginForm() {
    const loginForm = reactive<FormData>({
        userName: "",
        password: "",
        role: "information_manager",
        status: 0
    })

    let loginSucceed = ref<boolean>(false);
    let loginFail = ref<boolean>(false);
    let loginResponseMessage = ref<string>("");

    const submitLoginForm = async () => {
        try {
            const response = await postRequest('/auth/login', loginForm);
            const token = response.headers['authorization'];

            localStorage.setItem('token', token);
            loginResponseMessage.value = response.data.message;
            loginSucceed.value = true;
            loginFail.value = false;

            console.log(response);
            console.log('Token from headers:', token);
        } catch (error: any) {
            loginResponseMessage.value = error.response.data.message;
            loginFail.value = true;
            loginSucceed.value = false;

            console.log('登录失败！', error);
        }
    }

    return {
        loginForm,
        submitLoginForm,
        loginResponseMessage,
        loginSucceed,
        loginFail,
    }
}