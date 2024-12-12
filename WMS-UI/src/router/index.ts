import type {RouteRecordRaw} from "vue-router";
import {createRouter, createWebHistory, type Router} from "vue-router";
import {useAuthorizationStore} from "@/stores/authorizationStore.ts";
import {ElMessage} from "element-plus";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/SuperAdminDashboard',
        name: 'SuperAdminDashboard',
        component: () => import('@/views/SuperAdminDashboard.vue'),
        children: [
            {
                path: '/userList',
                name: 'UserList',
                component: () => import('@/views/UserList.vue')
            }
        ]
    },
];

const router: Router = createRouter({
    history: createWebHistory(),
    routes: routes
});


router.beforeEach(async (to, from) => {
    const authorizationStore = useAuthorizationStore();  // 在守卫内部调用 useAuthStore()

    // 获取 token
    const token = authorizationStore.token;

    // 如果没有 token 且目标页面不是登录页面，则重定向到登录页
    if (!token && to.name !== 'Login') {
        ElMessage.warning('请先登录以访问该页面');
        return { name: 'Login' };
    }
})

export default router;
