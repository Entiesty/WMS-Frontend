import { defineStore } from 'pinia';
import type { ItemCategory } from "@/types/Data.ts";

export const useItemCategoryStore = defineStore('itemCategory', {
    state: () => ({
        currentItemCategory: null as ItemCategory | null,
    }),
    actions: {
        setCurrentItemCategory(itemCategory: ItemCategory) {
            this.currentItemCategory = itemCategory;
        },
    },
});
