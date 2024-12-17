import {reactive, ref} from "vue";
import type {User} from "@/types/Data.ts";
import {putRequest} from "@/services/api.ts";
import {useUserList} from "@/hooks/user/useUserList.ts";
import {useUserFormValidation} from "@/hooks/user/useUserFormValidation.ts";

export function useUserEdit() {
    const editDialogFormVisible = ref<boolean>(false);
    const user = reactive<User>({
        createdAt: "", id: 0, password: "", role: "", status: "", updatedAt: "", userName: ""
    });
    const {fetchUsers} = useUserList();

    const {ruleForm} = useUserFormValidation(user.id);

    const editUser = (row: User) => {
        Object.assign(user, row);
        ruleForm.id = row.id
        editDialogFormVisible.value = true;
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
            await fetchUsers();
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const closeEditDialog = () => {
        editDialogFormVisible.value = false;
    };

    return {editDialogFormVisible, user, editUser, confirmUpdate, closeEditDialog};
}
