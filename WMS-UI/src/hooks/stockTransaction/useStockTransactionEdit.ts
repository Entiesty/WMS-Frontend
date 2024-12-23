import { reactive, ref } from "vue";
import type { StockTransaction } from "@/types/Data.ts";
import { putRequest } from "@/services/api.ts";
import { useStockTransactionList } from "@/hooks/stockTransaction/useStockTransactionList.ts";
import { useStockTransactionStore } from "@/stores/stockTransactionStore.ts"; // 假设你有相关的store
import { useAddOrEdit } from "@/stores/addOrEdit.ts"; // 假设该store适用于添加/编辑操作

export function useStockTransactionEdit() {
    const editDialogFormVisible = ref<boolean>(false);
    const stockTransaction = reactive<StockTransaction>({
        id: 0,
        itemName: "",
        quantity: 0,
        transactionType: "in",  // 默认交易类型
        sourceWarehouseName: "",
        targetWarehouseName: "",
        operatorName: "",
        transactionTime: "",
    });

    const { fetchData } = useStockTransactionList();
    const stockTransactionStore = useStockTransactionStore(); // 使用StockTransactionStore来管理当前交易数据

    const editStockTransaction = (row: StockTransaction) => {
        const addOrEdit = useAddOrEdit();
        console.log('这是row', row);
        stockTransactionStore.setCurrentStockTransaction(row);  // 假设你有此方法
        console.log('这是currentTransaction', stockTransactionStore.currentStockTransaction);
        Object.assign(stockTransaction, row);
        editDialogFormVisible.value = true;
        addOrEdit.setAddOrEdit('edit');
    };

    const confirmUpdate = async () => {
        const payload = {
            id: stockTransaction.id,
            itemName: stockTransaction.itemName,
            quantity: stockTransaction.quantity,
            transactionType: stockTransaction.transactionType,
            sourceWarehouseName: stockTransaction.sourceWarehouseName,
            targetWarehouseName: stockTransaction.targetWarehouseName,
            operatorName: stockTransaction.operatorName,
            transactionTime: stockTransaction.transactionTime,
        };

        try {
            await putRequest('/stockTransaction', payload);  // 更新URL为'/stockTransaction'
            console.log('StockTransaction updated successfully.');
            editDialogFormVisible.value = false;
            // 刷新表格数据
            await fetchData();
        } catch (error) {
            console.error('Failed to update stock transaction:', error);
        }
    };

    const closeEditDialog = () => {
        editDialogFormVisible.value = false;
    };

    return { editDialogFormVisible, stockTransaction, editStockTransaction, confirmUpdate, closeEditDialog };
}
