import { reactive, ref } from "vue";
import { postRequest } from "@/services/api.ts"; // 引入post请求
import { useAddOrEdit } from "@/stores/addOrEdit.ts";
import type {Item} from "@/types/Data.ts"; // 引入控制新增或编辑状态的 store

export function useItemAdd() {
    const addDialogFormVisible = ref<boolean>(false); // 控制对话框的显示与隐藏
    const newItem = reactive({
        itemName: '',          // 商品名称
        price: 0,              // 商品价格
        stock: 0,              // 商品库存
        itemCategoryName: '',     // 商品类别ID
        warehouseName: '',         // 仓库ID
        imageUrl: ''
    }); // 用于存储新增商品的数据

    // 提交新增商品请求
    const addItem = () => {
        const addOrEdit = useAddOrEdit();
        addDialogFormVisible.value = true;  // 显示新增对话框
        addOrEdit.setAddOrEdit('add');     // 设置为新增模式
    };

    const confirmAddItem = async () => {
        try {
            // 发送 post 请求以新增商品
            const response = await postRequest('/item', newItem);
            console.log('Item added successfully:', response);

            // 提交成功后，关闭表单对话框
            addDialogFormVisible.value = false;
            newItem.itemName = '';
            newItem.price = 0;
            newItem.stock = 0;
            newItem.itemCategoryName = ''
            newItem.warehouseName = '';
            newItem.imageUrl = '';
        } catch (error) {
            console.error('Failed to add item:', error);
        }
    };

    // 关闭对话框
    const closeAddDialog = () => {
        addDialogFormVisible.value = false;
    };

    return {
        addDialogFormVisible,
        newItem,
        addItem,
        confirmAddItem,
        closeAddDialog
    };
}
