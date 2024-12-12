import { defineStore } from 'pinia';

export const useAuthorizationStore = defineStore('authorization', {
    state: () => ({
        token: null as string | null, // 用来存储 token
        role: null as string | null,  // 用来存储角色信息
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
    },
    persist: true, // 启用持久化
});
