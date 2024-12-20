import { defineStore } from 'pinia';

export const useAuthorizationStore = defineStore('authorization', {
    state: () => ({
        token: null as string | null, // 用来存储 token
        role: null as string | null,  // 用来存储角色信息
        hasLoadedRoutes: false,
        userName: null as string | null, // 用来存储用户名
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
        },
        setUserName(newUserName: string) {
            this.userName = newUserName;
        }
    },
    persist: true, // 启用持久化
});
