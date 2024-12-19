import {reactive, ref} from "vue";
import type {Warehouse} from "@/types/Data.ts";
import {putRequest} from "@/services/api.ts";
import {useWarehouseList} from "@/hooks/warehouse/useWarehouseList.ts";
import {useWarehouseStore} from "@/stores/warehouseStore.ts";

export function useWarehouseEdit() {
    const editDialogFormVisible = ref<boolean>(false);
    const warehouse = reactive<Warehouse>({
        id: 0,warehouseName:'', location: '', createdAt: '', updatedAt: ''
    });
    const {fetchData} = useWarehouseList();
    const warehouseStore =  useWarehouseStore();

    const editWarehouse = (row: Warehouse) => {
        console.log('这是row', row);
        warehouseStore.setCurrentWarehouse(row);
        console.log('currentWarehouse', warehouseStore.currentWarehouse);
        Object.assign(warehouse, row);
        editDialogFormVisible.value = true;
    };

    const confirmUpdate = async () => {
        const payload = {
            id: warehouse.id,
            warehouseName: warehouse.warehouseName,
            location: warehouse.location,
        };

        try {
            await putRequest('/warehouse', payload);
            console.log('Warehouse updated successfully.');
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

    return {editDialogFormVisible, warehouse, editWarehouse, confirmUpdate, closeEditDialog};
}
