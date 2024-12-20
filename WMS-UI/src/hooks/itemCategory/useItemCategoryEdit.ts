import { reactive, ref } from "vue";
import type { ItemCategory } from "@/types/Data.ts";
import { putRequest } from "@/services/api.ts";
import { useItemCategoryList } from "@/hooks/itemCategory/useItemCategoryList.ts";
import { useItemCategoryStore } from "@/stores/itemCategoryStore.ts";
import { useAddOrEdit } from "@/stores/addOrEdit.ts";

export function useItemCategoryEdit() {
    const editDialogFormVisible = ref<boolean>(false);
    const itemCategory = reactive<ItemCategory>({
        id: 0, itemCategoryName: "", itemCategoryDescription: ""
    });

    const { fetchData } = useItemCategoryList(); // 获取数据的钩子
    const itemCategoryStore = useItemCategoryStore(); // 管理货品类别状态的 store

    // 编辑货品类别
    const editItemCategory = (row: ItemCategory) => {
        const addOrEdit = useAddOrEdit(); // 控制新增或编辑的状态
        console.log('这是row', row);
        itemCategoryStore.setCurrentItemCategory(row); // 将当前行的数据设置到 store 中
        console.log('这是currentItemCategory', itemCategoryStore.currentItemCategory);
        Object.assign(itemCategory, row); // 复制数据到编辑表单
        editDialogFormVisible.value = true; // 显示编辑对话框
        addOrEdit.setAddOrEdit('edit'); // 设置为编辑状态
    };

    // 确认更新货品类别
    const confirmUpdate = async () => {
        const payload = {
            id: itemCategory.id,
            itemCategoryName: itemCategory.itemCategoryName,
            itemCategoryDescription: itemCategory.itemCategoryDescription
        };

        try {
            await putRequest('/item-category', payload); // 发送 PUT 请求更新货品类别
            console.log('Item category updated successfully.');
            editDialogFormVisible.value = false; // 关闭编辑对话框
            await fetchData(); // 刷新数据
        } catch (error) {
            console.error('Failed to update item category:', error);
        }
    };

    // 关闭编辑对话框
    const closeEditDialog = () => {
        editDialogFormVisible.value = false;
    };

    return { editDialogFormVisible, itemCategory, editItemCategory, confirmUpdate, closeEditDialog };
}
