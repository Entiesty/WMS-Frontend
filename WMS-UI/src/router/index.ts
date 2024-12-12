import type {RouteRecordRaw} from "vue-router";
import {createRouter, createWebHistory, type Router, useRouter} from "vue-router";
import {useAuthorizationStore} from "@/stores/authorizationStore.ts";
import {ElMessage} from "element-plus";
import {useRegisterRoutes} from "@/hooks/useRegisterRoutes.ts";
import {getRequest} from "@/services/api.ts";

const staticRoutes: Array<RouteRecordRaw> = [
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
    routes: staticRoutes
});

export async function loadDynamicRoutes() {
    const router = useRouter();
    const {registerRoutes} = useRegisterRoutes(router);

    try {
        const role = useAuthorizationStore().role;
        // 假设从后端获取动态路由数据
        const {data: routes} = await getRequest(`/api/routes/${role}`);
        console.log(routes);

        // 注册动态路由
        registerRoutes(routes);
    } catch (error) {
        console.error('Failed to load dynamic routes:', error);
    }
}

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
