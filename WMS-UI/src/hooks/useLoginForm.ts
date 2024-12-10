import type {FormData} from "@/types/formData";
import {reactive, ref} from "vue";
import {getCaptchaImage, postRequest} from "@/services/api.ts";
import {useAuthStore} from "@/stores/authStore.ts";
import router from "@/router";

export default function useLoginForm() {
    const loginForm = reactive<FormData>({
        userName: "",
        password: "",
        role: "information_manager",
        status: 0,
        captcha: "",
    })

    let loginSucceed = ref<boolean>(false);
    let loginFail = ref<boolean>(false);
    let loginResponseMessage = ref<string>("");
    const authStore = useAuthStore();
    let loading = ref<boolean>(false);

    const submitLoginForm = async () => {
        if (loading.value) {
            return;
        }
        loading.value = true;

        try {
            const response = await postRequest('/authorization/login', loginForm);
            const token = response.headers['authorization'];

            localStorage.setItem('token', token);
            authStore.setToken(token);
            console.log("Pinia的Token: ", authStore.token)

            loginResponseMessage.value = response.data.message;
            loginSucceed.value = true;
            loginFail.value = false;

            console.log(response);
            console.log('Token from headers:', token);
            await router.push('/SuperAdminDashboard');
        } catch (error: any) {
            loginResponseMessage.value = error.response.data.message;
            loginFail.value = true;
            loginSucceed.value = false;

            console.log('登录失败！', error);
            await getCaptchaImage();
        } finally {
            loading.value = false;
        }
    };

    const captchaImageUrl = ref<string>("");
    const loadCaptcha = async () => {
        try {
            captchaImageUrl.value = await getCaptchaImage();
        } catch (error) {
            console.error("加载验证码失败:", error);
        }
    };

    // 更新验证码
    const updateCaptcha = async () => {
        return await loadCaptcha();
    };

    return {
        loginForm,
        submitLoginForm,
        loginResponseMessage,
        loginSucceed,
        loginFail,
        captchaImageUrl,
        updateCaptcha,
    }
}
