// src/hooks/useDynamicRoutes.ts
import { useRegisterRoutes } from "@/hooks/Authorization/useRegisterRoutes.ts";
import { useAuthorizationStore } from "@/stores/authorizationStore.ts";
import { getRequest } from "@/services/api.ts";
import { ElMessage } from "element-plus";
import type {Router} from "vue-router";

export const loadDynamicRoutes = async (router: Router) => {
    const { registerRoutes } = useRegisterRoutes(router);
    const role = useAuthorizationStore().role;

    try {
        const { data: routes } = await getRequest(`/route/${role}`);
        console.log('动态路由数据:', routes);
        registerRoutes(routes);
        console.log('动态路由加载成功');
    } catch (error) {
        console.error('加载动态路由失败:', error);
        ElMessage.error('加载路由失败，请稍后再试。');
    }
};


