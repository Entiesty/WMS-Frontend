import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { getRequest } from "@/services/api.ts"; // 如果有验证名称唯一的需求，可用该API
import { useWarehouseStore } from "@/stores/warehouseStore.ts";
import {useAddOrEdit} from "@/stores/addOrEdit.ts"; // 如果有使用仓库的store，可用此store

export function useWarehouseFormValidation() {
    const ruleFormRef = ref<FormInstance>();
    const ruleForm = reactive({
        id: 0,
        warehouseName: '',
        location: '',
    });
    const warehouseStore = useWarehouseStore(); // 如果有仓库Store，可在此使用

    // 仓库名的校验规则
    const checkWarehouseName = async (rule: any, value: string, callback: Function) => {
        const addOrEdit = useAddOrEdit().addOrEdit;
        if (warehouseStore.currentWarehouse) {
            ruleForm.id = warehouseStore.currentWarehouse.id!;
            ruleForm.warehouseName = warehouseStore.currentWarehouse.warehouseName;
            ruleForm.location = warehouseStore.currentWarehouse.location;
        }
        console.log('这是value', value);
        console.log('这是ruleForm', ruleForm);
        console.log('这是addOrEdit', addOrEdit);


        if (!value) {
            return callback(new Error('仓库名称不能为空'));
        }

        try {
            let response:any;
            if(addOrEdit === 'edit') {
                response = await getRequest(`/warehouse/validate-warehousename/update?warehouseName=${value}&warehouseId=${ruleForm.id}`);
            } else {
                response = await getRequest(`/warehouse/validate-warehousename/add?warehouseName=${value}`);
            }
            if (response.status === 409) {
                callback(new Error('仓库名已存在'));
            } else {
                callback();
            }
        } catch (error: any) {
            console.error('这是error', error);
            if(error.response.status === 409){
                callback(new Error('仓库名已存在'));
            }
            callback(new Error('验证仓库名时发生错误'));
        }
    };

    // 校验规则
    const rules = reactive<FormRules<typeof ruleForm>>({
        warehouseName: [
            { required: true, message: '仓库名称不能为空', trigger: 'blur' },
            { asyncValidator: checkWarehouseName, trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9\s\u4e00-\u9fa5-_]{3,50}$/, message: '仓库名称只能包含字母、数字、汉字、空格、"-"和"_"，长度为3到50个字符', trigger: 'blur' }
        ],
        location: [
            { required: true, message: '位置不能为空', trigger: 'blur' },
            // 允许包含字母、数字、汉字、空格、"-"和"_"
            { pattern: /^[a-zA-Z0-9\s\u4e00-\u9fa5-_]{2,100}$/, message: '位置只能包含字母、数字、汉字、空格、"-"和"_"，长度为5到100个字符', trigger: 'blur' }
        ]
    });

    return { ruleFormRef, rules, ruleForm };
}
