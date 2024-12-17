import type {Router} from "vue-router";

interface Route {
    id: number;
    name: string;
    path: string;
    children?: Route[];
}

export function useRegisterRoutes(router: Router) {
    function registerRoutes(routes: Route[], parentName: string | null = null) {
        routes.forEach((route) => {
            // 拼接正确的路径，确保路径是有效的
            const fullPath = parentName ? `/${parentName}/${route.path}` : `/${route.path}`;

            const newRoute = {
                path: fullPath.startsWith('/') ? fullPath : `/${fullPath}`, // 确保路径以 "/" 开头
                name: route.name,
                component: () => import(`@/views/${route.name}.vue`), // 使用 @ 确保路径解析正确
            };

            if (parentName) {
                // 如果有父路由，添加为子路由
                router.addRoute(parentName, newRoute);
            } else {
                // 没有父路由，添加为顶级路由
                router.addRoute(newRoute);
            }

            // 如果有子路由，递归注册
            if (route.children && route.children.length > 0) {
                registerRoutes(route.children, route.name); // 将当前路由名称作为子路由的父路由
            }
        });
    }

    return {
        registerRoutes,
    };
}




