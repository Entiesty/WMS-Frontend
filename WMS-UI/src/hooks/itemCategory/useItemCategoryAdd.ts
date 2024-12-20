import { reactive, ref } from "vue";
import { postRequest } from "@/services/api.ts"; // 引入post请求
import { useAddOrEdit } from "@/stores/addOrEdit.ts"; // 引入获取仓库列表的hook

export function useItemCategoryAdd() {
    const addDialogFormVisible = ref<boolean>(false); // 控制对话框的显示与隐藏
    const newItemCategory = reactive({
        itemCategoryName: '',        // 类别名称
        itemCategoryDescription: ''  // 类别描述
    }); // 用于存储新增货品类别的数据


    // 提交新增货品类别请求
    const addItemCategory = () => {
        const addOrEdit = useAddOrEdit();
        addDialogFormVisible.value = true;
        addOrEdit.setAddOrEdit('add');
    };

    const confirmAddItemCategory = async () => {
        try {
            // 发送 post 请求以新增货品类别
            const response = await postRequest('/item-category', newItemCategory);
            console.log('Item category added successfully:', response);

            // 提交成功后，关闭表单对话框
            addDialogFormVisible.value = false;
            newItemCategory.itemCategoryName = '';
            newItemCategory.itemCategoryDescription = '';
        } catch (error) {
            console.error('Failed to add item category:', error);
        }
    };

    // 关闭对话框
    const closeAddDialog = () => {
        addDialogFormVisible.value = false;
    };

    return {
        addDialogFormVisible,
        newItemCategory,
        addItemCategory,
        confirmAddItemCategory,
        closeAddDialog
    };
}
