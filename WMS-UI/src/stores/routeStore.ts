import { defineStore } from 'pinia';
import type { Route } from "@/types/Data.ts";  // 假设 Route 类型已经定义在 "@/types/Route.ts"

export const useRouteStore = defineStore('route', {
    state: () => ({
        currentRoute: null as Route | null,  // 存储当前路由信息
    }),
    actions: {
        setCurrentRoute(route: Route) {
            this.currentRoute = route;  // 设置当前路由
        },

        clearCurrentRoute() {
            this.currentRoute = null;  // 清空当前路由
        },

        // 示例：设置默认路由，可以根据需要扩展
        setDefaultRoute() {
            this.currentRoute = {
                id: 0,
                name: "Default Route",
                path: "/",
                parentId: 0,
                children: [],
            };  // 设置默认路由
        }
    },
});
