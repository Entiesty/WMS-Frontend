import {reactive, ref} from "vue";
import type {User} from "@/types/Data.ts";
import {putRequest} from "@/services/api.ts";
import {useUserList} from "@/hooks/user/useUserList.ts";
import {useUserStore} from "@/stores/userStore.ts";
import {useAddOrEdit} from "@/stores/addOrEdit.ts";

export function useUserEdit() {
    const editDialogFormVisible = ref<boolean>(false);
    const user = reactive<User>({
        createdAt: "", id: 0, password: "", role: "", status: "", updatedAt: "", userName: ""
    });
    const {fetchData} = useUserList();
    const userStore =  useUserStore();

    const editUser = (row: User) => {
        const addOrEdit = useAddOrEdit();
        console.log('这是row', row);
        userStore.setCurrentUser(row);
        console.log('这是currentUser', userStore.currentUser);
        Object.assign(user, row);
        editDialogFormVisible.value = true;
        addOrEdit.setAddOrEdit('edit');
    };

    const confirmUpdate = async () => {
        const payload = {
            id: user.id,
            userName: user.userName,
            password: user.password,
            role: user.role,
            status: user.status,
        };

        try {
            await putRequest('/user', payload);
            console.log('User updated successfully.');
            editDialogFormVisible.value = false;
            // 刷新表格数据
            await fetchData();
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const closeEditDialog = () => {
        editDialogFormVisible.value = false;
    };

    return {editDialogFormVisible, user, editUser, confirmUpdate, closeEditDialog};
}
