// src/stores/authorizationStore.ts
import { defineStore } from 'pinia';

export const useAuthorizationStore = defineStore('authorization', {
    state: () => ({
        token: null as string | null, // 存储 token
        role: null as string | null,  // 存储角色
        userName: null as string | null, // 存储用户名
        routes: [] as any[],  // 存储动态路由
        hasLoadedRoutes: false,  // 标记路由是否已经加载
    }),
    actions: {
        setToken(newToken: string) {
            this.token = newToken;
        },
        clearToken() {
            this.token = null;
        },
        setRole(newRole: string) {
            this.role = newRole;
        },
        clearRole() {
            this.role = null;
        },
        setUserName(newUserName: string) {
            this.userName = newUserName;
        },
        setRoutes(routes: any[]) {
            this.routes = routes;
        },
        clearRoutes() {
            this.routes = [];
        },
        setHasLoadedRoutes(status: boolean) {
            this.hasLoadedRoutes = status;
        }
    },
    persist: true, // 启用持久化
});
