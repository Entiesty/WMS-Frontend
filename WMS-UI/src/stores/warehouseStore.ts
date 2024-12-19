import { defineStore } from 'pinia';
import type {Warehouse} from "@/types/Data.ts";

export const useWarehouseStore = defineStore('warehouse', {
    state: () => ({
        currentWarehouse: null as Warehouse | null,
    }),
    actions: {
        setCurrentWarehouse(warehouse: Warehouse) {
            this.currentWarehouse = warehouse;
        },
    },
});
