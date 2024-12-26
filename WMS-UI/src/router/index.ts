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
    },
    {
        path: '/:pathMatch(.*)*', // 捕获所有未匹配的路径
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'), // 404 页面
        meta: { requiresAuth: false }
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

    // 检查目标路由是否存在
    const routeExists = router.getRoutes().some(route => route.name === to.name);
    if (!routeExists) {
        ElMessage.warning('该页面不存在或您没有权限访问');
        return { name: 'NotFound' }; // 路由不存在时跳转到 404 页面
    }
});

export default router;
