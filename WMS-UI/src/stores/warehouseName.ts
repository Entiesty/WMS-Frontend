import { defineStore } from 'pinia';

export const useWarehouseName = defineStore('WarehouseName', {
    state: () => ({
        currentWarehouseName: null as string | null,  // 用于存储当前的 Item
    }),
    actions: {
        setCurrentWarehouseName(WarehouseName: string) {
            this.currentWarehouseName = WarehouseName;  // 设置当前的 Item
        },
    },
});