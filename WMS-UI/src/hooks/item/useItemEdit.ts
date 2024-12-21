import { reactive, ref } from "vue";
import type { Item } from "@/types/Data.ts";  // 引入 Item 类型
import { putRequest } from "@/services/api.ts";
import { useItemList } from "@/hooks/item/useItemList.ts";  // 修改为 Item 列表钩子
import { useItemStore } from "@/stores/itemStore.ts";  // 修改为 Item store
import { useAddOrEdit } from "@/stores/addOrEdit.ts";

export function useItemEdit() {
    const editDialogFormVisible = ref<boolean>(false);
    const item = reactive<Item>({
        id: 0, itemName: "", price: 0, imageUrl: "", stock: 0, itemCategoryName: '', warehouseName: ''
    });
    const { fetchData } = useItemList();  // 获取 Item 列表数据
    const itemStore = useItemStore();

    const editItem = (row: Item) => {
        const addOrEdit = useAddOrEdit();
        console.log('这是row', row);
        itemStore.setCurrentItem(row);  // 设置当前编辑的 Item
        console.log('这是currentItem', itemStore.currentItem);
        Object.assign(item, row);
        editDialogFormVisible.value = true;
        addOrEdit.setAddOrEdit('edit');
    };

    const confirmUpdate = async () => {
        const payload = {
            id: item.id,
            itemName: item.itemName,
            price: item.price,
            imageUrl: item.imageUrl,
            stock: item.stock,
            itemCategoryName: item.itemCategoryName,
            warehouseName: item.warehouseName
        };

        try {
            await putRequest('/item', payload);  // 修改请求路径为 /item
            console.log('Item updated successfully.');
            editDialogFormVisible.value = false;
            // 刷新表格数据
            await fetchData();
        } catch (error) {
            console.error('Failed to update item:', error);
        }
    };

    const closeEditDialog = () => {
        editDialogFormVisible.value = false;
    };

    return { editDialogFormVisible, item, editItem, confirmUpdate, closeEditDialog };
}
