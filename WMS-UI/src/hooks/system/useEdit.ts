import { reactive, ref } from "vue";
import { putRequest, getRequest } from "@/services/api.ts";

// 添加约束，确保泛型 T 是一个对象类型
export function useEdit<T extends Record<string, any>>(entityName: string, initialEntity: T, fetchData: Function) {
    // 编辑表单的可见性
    const editDialogFormVisible = ref<boolean>(false);

    // 用于编辑的实体对象
    const entity = reactive<T>(initialEntity);

    // 编辑表单的基本操作
    const editEntity = (row: T) => {
        Object.assign(entity, row); // 将选中的行数据赋值给实体
        editDialogFormVisible.value = true; // 打开编辑弹框
    };

    // 提交编辑请求
    const confirmUpdate = async () => {
        try {
            // 提交 PUT 请求
            await putRequest(`/${entityName}`, entity);
            console.log(`${entityName} updated successfully.`);
            editDialogFormVisible.value = false;
            // 刷新表格数据
            await fetchData();
        } catch (error) {
            console.error(`Failed to update ${entityName}:`, error);
        }
    };

    // 关闭编辑对话框
    const closeEditDialog = () => {
        editDialogFormVisible.value = false;
    };

    // 获取单个实体数据（可选）
    const fetchEntity = async (id: number) => {
        try {
            const response = await getRequest(`/${entityName}/${id}`);
            Object.assign(entity, response.data); // 将返回的数据填充到实体对象中
        } catch (error) {
            console.error(`Failed to fetch ${entityName}:`, error);
        }
    };

    return {
        editDialogFormVisible,
        entity,
        editEntity,
        confirmUpdate,
        closeEditDialog,
        fetchEntity,
    };
}
