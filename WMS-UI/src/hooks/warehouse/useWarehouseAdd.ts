// hooks/warehouse/useWarehouseAdd.ts
import {reactive, ref} from "vue";
import {postRequest} from "@/services/api.ts"; // 引入post请求

export function useWarehouseAdd() {
    const addDialogFormVisible = ref<boolean>(false); // 控制对话框的显示与隐藏
    const newWarehouse = reactive({
        warehouseName: '',
        location: '',
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '), // 格式化为 yyyy-mm-dd hh:mm:ss
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')  // 格式化为 yyyy-mm-dd hh:mm:ss
    }); // 用于存储新增仓库的数据

    // 提交新增仓库请求
    const addWarehouse = () => {
        addDialogFormVisible.value = true;
    };

    const confirmAddWarehouse = async () => {
        try {
            // 发送 post 请求以新增仓库
            const response = await postRequest('/warehouse', newWarehouse);
            console.log('Warehouse added successfully:', response);

            // 提交成功后，关闭表单对话框
            addDialogFormVisible.value = false;
            newWarehouse.warehouseName='';
            newWarehouse.location='';
        } catch (error) {
            console.log(error);
            console.error('Failed to add warehouse:', error);
        }
    }

    // 关闭对话框
    const closeAddDialog = () => {
        addDialogFormVisible.value = false;
    };

    return {
        addDialogFormVisible,
        newWarehouse,
        addWarehouse,
        confirmAddWarehouse,
        closeAddDialog
    };
}
