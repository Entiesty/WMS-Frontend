import type {RouteRecordRaw} from "vue-router";
import {createRouter, createWebHistory, type Router} from "vue-router";
import {useAuthorizationStore} from "@/stores/authorizationStore.ts";
import {ElMessage} from "element-plus";
import {useRoleRedirect} from "@/hooks/Authorization/useRoleRedirect.ts";

const staticRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    }
];

const router: Router = createRouter({
    history: createWebHistory(),
    routes: staticRoutes
});

router.beforeEach(async (to, from) => {
    const authorizationStore = useAuthorizationStore();
    const { redirectToRolePage } = useRoleRedirect();

    const token = authorizationStore.token;

    if (!token && to.name !== 'Login') {
        ElMessage.warning('请先登录以访问该页面');
        return { name: 'Login' };
    }
});

export default router;
