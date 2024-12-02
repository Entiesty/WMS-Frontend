import {reactive, ref} from "vue";
import type {FormData} from "@/types/formData.ts";
import {postRequest} from "@/services/api.ts";


export default function useRegisterForm() {
    const registerForm = reactive<FormData>({
        userName: "",
        password: "",
        role: "information_manager",
        status: 0
    })

    let registerSucceed = ref<boolean>(false);
    let registerFail = ref<boolean>(false);
    let responseMessage = ref<string>("");

    const submitRegisterForm = async () => {
        try {
            const response = await postRequest('/auth/register', registerForm);
            console.log(response);

            registerSucceed.value = true;
            registerFail.value = false;
            responseMessage.value = response.data.message;
        } catch (error:any) {
            console.log('错误信息：', error)
            responseMessage.value = error.response.data.message;
            console.log("responseMessage", error.response.data.message);
            registerFail.value = true;
            registerSucceed.value = false;
            throw error;
        }
    }

    return {
        registerForm,
        submitRegisterForm,
        responseMessage,
        registerSucceed,
        registerFail,
    }
}