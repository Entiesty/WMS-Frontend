// src/hooks/useAuthGuard.ts
import { useAuthorizationStore } from "@/stores/authorizationStore.ts";
import { ElMessage } from "element-plus";
import type { Router } from "vue-router";

export function useAuthGuard(router: Router) {
    router.beforeEach(async (to, from) => {
        const authorizationStore = useAuthorizationStore();
        const token = authorizationStore.token;  // 缓存 token

        if (!token && to.name !== 'Login') {
            ElMessage.warning('请先登录以访问该页面');
            return { name: 'Login' };
        }
    });
}
