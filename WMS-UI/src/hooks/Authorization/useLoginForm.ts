// src/hooks/useLoginForm.ts
import {reactive, ref} from "vue";
import {postRequest} from "@/services/api.ts";
import {useAuthorizationStore} from "@/stores/authorizationStore.ts";
import {useCaptcha} from "@/hooks/Authorization/useCaptcha.ts";
import {useRoleRedirect} from "@/hooks/Authorization/useRoleRedirect.ts";

export default function useLoginForm() {
    const loginForm = reactive({
        userName: "",
        password: "",
        role: "information_manager",
        status: 0,
        captcha: "",
    });

    const loginSucceed = ref(false);
    const loginFail = ref(false);
    const loginResponseMessage = ref("");
    const loading = ref(false);
    const authorizationStore = useAuthorizationStore();
    const { captchaImageUrl, loadCaptcha } = useCaptcha();
    const { redirectToRolePage } = useRoleRedirect();

    const submitLoginForm = async () => {
        if (loading.value) {
            return;
        }
        loading.value = true;

        try {
            const response = await postRequest('/authorization/login', loginForm);
            const token = response.headers['authorization'];
            const role = response.headers['role'];
            const userName = response.headers['username'];


            authorizationStore.setToken(token);
            authorizationStore.setRole(role);
            authorizationStore.setUserName(userName);

            loginResponseMessage.value = response.data.message;
            loginSucceed.value = true;
            loginFail.value = false;

            console.log("登录成功:", response);

            await redirectToRolePage(role);
        } catch (error: any) {
            loginResponseMessage.value = error?.response?.data?.message || "登录失败";
            loginFail.value = true;
            loginSucceed.value = false;
            console.error("登录失败:", error);

            // 更新验证码
            await loadCaptcha();
        } finally {
            loading.value = false;
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
    };
}
