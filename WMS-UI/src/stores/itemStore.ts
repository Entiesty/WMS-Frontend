import { defineStore } from 'pinia';
import type { Item } from "@/types/Data.ts";  // 引入 Item 类型

export const useItemStore = defineStore('item', {
    state: () => ({
        currentItem: null as Item | null,  // 用于存储当前的 Item
    }),
    actions: {
        setCurrentItem(item: Item) {
            this.currentItem = item;  // 设置当前的 Item
        },
    },
});
