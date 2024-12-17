import {createRouter, createWebHistory, type Router} from "vue-router";
import {useAuthGuard} from "@/hooks/Authorization/useAuthorizationGuard.ts";

// 静态路由
const staticRoutes = [
    {
        path: '/',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
];

// 创建路由实例
const router: Router = createRouter({
    history: createWebHistory(),
    routes: staticRoutes
});

// 使用路由守卫
useAuthGuard(router);

export default router;

