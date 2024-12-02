import {reactive} from "vue";
import type {FormData} from "@/types/formData.ts";
import {postRequest} from "@/services/api.ts";


export default function useRegisterForm() {
    const registerForm = reactive<FormData>({
        userName: "",
        password: "",
        role: "information_manager",
        status: 0
    })

    const submitRegisterForm = async ()=> {
        try {
            const response = await postRequest('/user', registerForm);
            console.log(response);


        } catch (error) {
            console.log('注册失败！', error);
        }
    }

    return {
        registerForm,
        submitRegisterForm
    }
}