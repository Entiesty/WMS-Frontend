import type {Router} from "vue-router";

interface Route {
    id: number;
    name: string;
    path: string;
    children?: Route[];
}

export function useRegisterRoutes(router: Router) {
    /**
     * 注册动态路由
     * @param routes 从后端获取的动态路由数据
     */
    function registerRoutes(routes: Route[]) {
        routes.forEach((route) => {
            const newRoute = {
                path: route.path,
                name: route.name,
                component: () => import(`@/views/${route.name}.vue`), // 假设组件名和 name 一致
            };

            router.addRoute(newRoute);

            // 如果有子路由，递归注册
            if (route.children && route.children.length > 0) {
                registerRoutes(route.children);
            }
        });
    }

    return {
        registerRoutes,
    };
}
