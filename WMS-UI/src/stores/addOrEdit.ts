import { defineStore } from 'pinia';

export const useAddOrEdit = defineStore('addOrEdit', {
    state: () => ({
        addOrEdit: 'add',
    }),
    actions: {
        setAddOrEdit(visible: string) {
            this.addOrEdit = visible;
        },
    },
});