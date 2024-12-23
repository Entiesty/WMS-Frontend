import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { getRequest } from "@/services/api.ts"; // 引入 GET 请求
import { useStockTransactionStore } from "@/stores/stockTransactionStore.ts"; // 使用库存交易store
import { useAddOrEdit } from "@/stores/addOrEdit.ts"; // 用于获取添加或编辑状态

export function useStockTransactionFormValidation() {
    const ruleFormRef = ref<FormInstance>();
    const ruleForm = reactive({
        id: 0,
        itemName: '',
        quantity: 0,
        transactionType: 'in',  // 默认类型
        sourceWarehouseName: '',
        targetWarehouseName: '',
        operatorName: '',
        transactionTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    });

    const stockTransactionStore = useStockTransactionStore(); // 使用库存交易store

    const checkItemName = async (rule: any, value: string, callback: Function) => {
        const addOrEdit = useAddOrEdit().addOrEdit; // 判断是添加还是编辑操作
        if (stockTransactionStore.currentStockTransaction) {
            ruleForm.id = stockTransactionStore.currentStockTransaction.id;
            ruleForm.itemName = stockTransactionStore.currentStockTransaction.itemName;
        }

        console.log('这是value', value);
        console.log('这是addOrEdit', addOrEdit);

        if (!value) {
            return callback(new Error('物品名称不能为空'));
        }

        try {
            let response: any;
            if (addOrEdit === 'edit') {
                response = await getRequest(`/stockTransaction/validate-itemName/update?itemName=${value}&transactionId=${ruleForm.id}`);
            } else {
                response = await getRequest(`/stockTransaction/validate-itemName/add?itemName=${value}`);
            }

            if (response.status === 409) {
                callback(new Error('物品名称已存在'));
            } else {
                callback();
            }
        } catch (error: any) {
            console.error('这是error', error);
            if (error.response.status === 409) {
                callback(new Error('物品名称已存在'));
            }
            callback(new Error('验证物品名称时发生错误'));
        }
    };

    const rules = reactive<FormRules<typeof ruleForm>>({
        itemName: [
            { required: true, message: '物品名称不能为空', trigger: 'blur' },
            // { asyncValidator: checkItemName, trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9\s\u4e00-\u9fa5-_()]{3,50}$/, message: '商品名称只能包含字母、数字、汉字、空格、"-"、"_"和括号，长度为3到50个字符', trigger: 'blur' }
        ],
        quantity: [
            { required: true, message: '数量不能为空', trigger: 'blur' },
            { pattern: /^[1-9]\d*$/, message: '数量必须是正整数', trigger: 'blur' },
            { min: 1, message: '数量必须大于0', trigger: 'blur' }
        ],
        transactionType: [
            { required: true, message: '请选择交易类型', trigger: 'change' },
        ],
        sourceWarehouseName: [
            { required: true, message: '仓库名称不能为空', trigger: 'blur' },
        ],
        operatorName: [
            { required: true, message: '操作员名称不能为空', trigger: 'blur' },
        ],
    });

    return { ruleFormRef, rules, ruleForm };
}
