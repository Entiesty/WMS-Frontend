import {createRouter, createWebHistory, type Router} from "vue-router";
import type {RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
];

const router : Router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router;