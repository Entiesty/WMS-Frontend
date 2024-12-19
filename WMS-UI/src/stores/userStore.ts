import { defineStore } from 'pinia';
import type {User} from "@/types/Data.ts";

export const useUserStore = defineStore('user', {
    state: () => ({
        currentUser: null as User | null,
    }),
    actions: {
        setCurrentUser(user: User) {
            this.currentUser = user;
        },
    },
});
