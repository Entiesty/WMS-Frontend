import {defineStore} from 'pinia';

export const useAuthorizationStore = defineStore('auth', {
    state: () => ({
        token: null, // 用来存储 token
    }),
    actions: {
        setToken(newToken: any) {
            this.token = newToken;
        },
        clearToken() {
            this.token = null;
        },
    },
    persist: true,  // 启用持久化
});
