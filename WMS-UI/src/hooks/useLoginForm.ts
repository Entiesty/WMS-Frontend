import type {FormData} from "@/types/formData";
import {reactive, ref} from "vue";
import {postRequest} from "@/services/api.ts";
import {useAuthStore} from "@/stores/authStore.ts";
import axios from "axios";

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
    const getCaptchaImage = async () => {
        try {
            const response = await axios.get('http://localhost:8080/authorization/captcha', {
                responseType: 'arraybuffer', // 获取字节流
                withCredentials: true,
            });
            // 将字节流转换为 Blob 对象
            const blob = new Blob([response.data], {type: 'image/png'});

            // 生成一个 URL 供 img 标签使用
            const imageUrl = URL.createObjectURL(blob);

            captchaImageUrl.value = imageUrl; // 保存图片 URL
            return imageUrl;
        } catch (error) {
            console.error("获取验证码失败:", error);
            return "";
        }
    };

    // 更新验证码
    const updateCaptcha = async () => {
        return await getCaptchaImage();
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
