import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { getRequest } from "@/services/api.ts";
import { useItemStore } from "@/stores/itemStore.ts";  // 使用 Item store
import { useAddOrEdit } from "@/stores/addOrEdit.ts";

export function useItemFormValidation() {
    const ruleFormRef = ref<FormInstance>();
    const ruleForm = reactive({
        id: 0,
        itemName: '',
        price: 0,
        stock: 0,
    });
    const itemStore = useItemStore();

    const checkItemName = async (rule: any, value: string, callback: Function) => {
        const addOrEdit = useAddOrEdit().addOrEdit;
        if (itemStore.currentItem) {
            ruleForm.id = itemStore.currentItem.id;
            ruleForm.itemName = itemStore.currentItem.itemName;
            ruleForm.price = itemStore.currentItem.price;
            ruleForm.stock = itemStore.currentItem.stock;
        }
        console.log('这是value', value);
        console.log('这是addOrEdit', addOrEdit);

        if (!value) {
            return callback(new Error('商品名称不能为空'));
        }

        try {
            let response: any;
            if (addOrEdit === 'edit') {
                response = await getRequest(`/item/validate-item-name/update?itemName=${value}&itemId=${ruleForm.id}`);
            } else {
                response = await getRequest(`/item/validate-item-name/add?itemName=${value}`);
            }
            if (response.status === 409) {
                callback(new Error('商品名称已存在'));
            } else {
                callback();
            }
        } catch (error: any) {
            console.error('这是error', error);
            if (error.response.status === 409) {
                callback(new Error('商品名称已存在'));
            }
            callback(new Error('验证商品名称时发生错误'));
        }
    };

    const rules = reactive<FormRules<typeof ruleForm>>({
        itemName: [
            { required: true, message: '商品名称不能为空', trigger: 'blur' },
            { asyncValidator: checkItemName, trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]{3,50}$/, message: '商品名称只能包含字母、数字和中文，长度为3到50个字符', trigger: 'blur' }
        ],
        price: [
            { required: true, message: '价格不能为空', trigger: 'blur' },
            { pattern: /^[1-9]\d*(\.\d+)?$/, message: '请输入有效的价格', trigger: 'blur' }
        ],
        stock: [
            { required: true, message: '库存不能为空', trigger: 'blur' },
            { pattern: /^[1-9]\d*$/, message: '库存必须是正整数', trigger: 'blur' }
        ]
    });

    return { ruleFormRef, rules, ruleForm };
}
