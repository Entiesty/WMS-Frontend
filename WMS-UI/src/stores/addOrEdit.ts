import { defineStore } from 'pinia';

export const useAddOrEdit = defineStore('addOrEdit', {
    state: () => ({
        addOrEdit: null as string | null,
    }),
    actions: {
        setAddOrEdit(visible: string) {
            this.addOrEdit = visible;  // 更新 addOrEdit 状态
        },
    },
});
