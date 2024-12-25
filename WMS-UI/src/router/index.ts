import type {RouteRecordRaw} from "vue-router";
import {createRouter, createWebHistory, type Router} from "vue-router";
import {useAuthorizationStore} from "@/stores/authorizationStore.ts";
import {ElMessage} from "element-plus";
import StockFlowChart from "@/views/StockFlowChart.vue";
import EnterpriseInformation from "@/views/EnterpriseInformation.vue";
import TopStockTransactions from "@/views/TopStockTransactions.vue";
import {loadDynamicRoutes} from "@/hooks/Authorization/useDynamicRoutes.ts";

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
                path: 'userList',
                name: 'UserList',
                component: () => import('@/views/UserList.vue')
            },
            {
                path: 'warehouseList',
                name: 'WarehouseList',
                component: () => import('@/views/WarehouseList.vue')
            },
            {
                path: 'personalInformation',
                name: 'PersonalInformation',
                component: () => import('@/views/PersonalInformation.vue')
            },
            {
                path: 'itemCategoryList',
                name: 'ItemCategoryList',
                component: () => import('@/views/ItemCategoryList.vue')
            },
            {
                path: 'itemList',
                name: 'ItemList',
                component: () =>import('@/views/ItemList.vue')
            },
            {
                path: 'stockTransactionList',
                name: 'StockTransactionList',
                component: () => import('@/views/StockTransactionList.vue')
            },
            {
                path: 'stockFlowChart',
                name: 'StockFlowChart',
                component: StockFlowChart
            },
            {
                path: 'enterpriseInformation',
                name: 'EnterpriseInformation',
                component: EnterpriseInformation
            },
            {
                path: 'topStockTransactions',
                name: 'TopStockTransactions',
                component: TopStockTransactions
            },
            {
                path: 'mainContent',
                name: 'MainContent',
                component: () => import('@/views/MainContent.vue')
            }
        ]
    },
];

const router: Router = createRouter({
    history: createWebHistory(),
    routes: staticRoutes
});

router.beforeEach(async (to, from) => {
    const authorizationStore = useAuthorizationStore();

    const token = authorizationStore.token;

    if (!token && to.name !== 'Login') {
        ElMessage.warning('请先登录以访问该页面');
        return { name: 'Login' };
    }

    // 确保动态路由已加载
    if (!authorizationStore.hasLoadedRoutes) {
        await loadDynamicRoutes(router);
        authorizationStore.setHasLoadedRoutes(true);
    }
});

export default router;
