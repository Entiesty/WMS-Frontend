import { reactive, ref } from "vue";
import type { FormData } from "@/types/Data.ts";
import { postRequest } from "@/services/api.ts";
import { ElMessage } from "element-plus";

export default function useRegisterForm() {
    const registerForm = reactive<FormData>({
        userName: "",
        password: "",
        role: "information_manager",
        status: 0,
    });

    let registerResponseMessage = ref<string>("");

    const submitRegisterForm = async () => {
        try {
            const response = await postRequest('/authorization/register', registerForm);
            console.log(response);

            registerResponseMessage.value = response.data.message;

            // Display success message using ElMessage
            ElMessage.success(registerResponseMessage.value);
            registerForm.userName = '';
            registerForm.password = '';

        } catch (error: any) {
            console.log('错误信息：', error);
            registerResponseMessage.value = error.response?.data?.message || "注册失败";

            // Display error message using ElMessage
            ElMessage.error(registerResponseMessage.value);
        }
    };

    return {
        registerForm,
        submitRegisterForm,
        registerResponseMessage,
    };
}
