import { reactive, ref } from "vue";
import { postRequest } from "@/services/api.ts"; // 引入post请求
import { useAddOrEdit } from "@/stores/addOrEdit.ts";
import {ElMessage} from "element-plus"; // 引入获取仓库列表的hook

export function useStockTransactionAdd() {
    const addDialogFormVisible = ref<boolean>(false); // 控制对话框的显示与隐藏
    const newStockTransaction = reactive({
        itemName: '',
        quantity: 0,
        transactionType: 'in',  // 默认交易类型为 'in'
        sourceWarehouseName: '',
        targetWarehouseName: '',
        operatorName: '',
    }); // 用于存储新增库存交易的数据

    // 提交新增库存交易请求
    const addStockTransaction = () => {
        const addOrEdit = useAddOrEdit();
        addDialogFormVisible.value = true;
        addOrEdit.setAddOrEdit('add');
    };

    const confirmAddStockTransaction = async () => {
        try {
            // 发送 post 请求以新增库存交易
            const response = await postRequest('/stockTransaction', newStockTransaction);
            console.log('StockTransaction added successfully:', response);

            // 提交成功后，关闭表单对话框
            addDialogFormVisible.value = false;
            // 清空表单
            newStockTransaction.itemName = '';
            newStockTransaction.quantity = 0;
            newStockTransaction.transactionType = 'in';
            newStockTransaction.sourceWarehouseName = '';
            newStockTransaction.targetWarehouseName = '';
            newStockTransaction.operatorName = '';
        } catch (error: any) {
            console.log(error);
            ElMessage.error(error?.response?.data?.message);
            console.error('Failed to add stock transaction:', error);
        }
    };

    // 关闭对话框
    const closeAddDialog = () => {
        addDialogFormVisible.value = false;
    };

    return {
        addDialogFormVisible,
        newStockTransaction,
        addStockTransaction,
        confirmAddStockTransaction,
        closeAddDialog
    };
}
