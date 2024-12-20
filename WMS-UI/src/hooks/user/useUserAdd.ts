// hooks/warehouse/useWarehouseAdd.ts
import {reactive, ref} from "vue";
import {postRequest} from "@/services/api.ts"; // 引入post请求
import {useAddOrEdit} from "@/stores/addOrEdit.ts"; // 引入获取仓库列表的hook

export function useUserAdd() {
    const addDialogFormVisible = ref<boolean>(false); // 控制对话框的显示与隐藏
    const newUser = reactive({
        userName: '',
        password: '',
        role: '',
        status: '',
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '), // 格式化为 yyyy-mm-dd hh:mm:ss
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')  // 格式化为 yyyy-mm-dd hh:mm:ss
    }); // 用于存储新增仓库的数据

    // 提交新增仓库请求
    const addUser = () => {
        const addOrEdit = useAddOrEdit();
        addDialogFormVisible.value = true;
        addOrEdit.setAddOrEdit('add');
    };

    const confirmAddUser = async () => {
        try {
            // 发送 post 请求以新增仓库
            const response = await postRequest('/user', newUser);
            console.log('User added successfully:', response);

            // 提交成功后，关闭表单对话框
            addDialogFormVisible.value = false;
            newUser.userName='';
            newUser.password='';
        } catch (error) {
            console.log(error);
            console.error('Failed to add user:', error);
        }
    }

    // 关闭对话框
    const closeAddDialog = () => {
        addDialogFormVisible.value = false;
    };

    return {
        addDialogFormVisible,
        newUser,
        addUser,
        confirmAddUser,
        closeAddDialog
    };
}
