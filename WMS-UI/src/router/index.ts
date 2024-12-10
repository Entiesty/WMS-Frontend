import type {RouteRecordRaw} from "vue-router";
import {createRouter, createWebHistory, type Router} from "vue-router";

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


export default router;