// src/hooks/useCaptcha.ts
import { ref } from "vue";
import { getCaptchaImage } from "@/services/api.ts";

export function useCaptcha() {
    const captchaImageUrl = ref<string>('');
    const isCaptchaLoading = ref(false);

    const loadCaptcha = async () => {
        if (isCaptchaLoading.value) return;  // 防止重复请求
        isCaptchaLoading.value = true;
        try {
            captchaImageUrl.value = await getCaptchaImage();
        } catch (error) {
            console.error('加载验证码失败:', error);
        } finally {
            isCaptchaLoading.value = false;
        }
    };

    return { captchaImageUrl, loadCaptcha };
}
