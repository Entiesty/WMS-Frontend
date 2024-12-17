import { defineStore } from 'pinia';

export const useAuthorizationStore = defineStore('authorization', {
    state: () => ({
        token: null as string | null, // 用来存储 token
        role: null as string | null,  // 用来存储角色信息
        hasLoadedRoutes: false,
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
        setHasLoadedRoutes(status: boolean) {
            this.hasLoadedRoutes = status;
        }
    },
    persist: true, // 启用持久化
});
