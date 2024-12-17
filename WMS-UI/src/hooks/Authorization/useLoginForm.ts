// src/hooks/useLoginForm.ts
import { reactive, ref } from "vue";
import { postRequest } from "@/services/api.ts";
import { useAuthorizationStore } from "@/stores/authorizationStore.ts";
import { useCaptcha } from "@/hooks/Authorization/useCaptcha.ts";
import { loadDynamicRoutes } from "@/hooks/Authorization/useDynamicRoutes.ts";
import { useRoleRedirect } from "@/hooks/Authorization/useRoleRedirect.ts";
import router from "@/router";

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

            authorizationStore.setToken(token);
            authorizationStore.setRole(role);

            loginResponseMessage.value = response.data.message;
            loginSucceed.value = true;
            loginFail.value = false;

            // 先加载动态路由
            await loadDynamicRoutes(router);

            // 跳转到角色对应的页面
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
