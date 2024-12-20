import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { getRequest } from "@/services/api.ts"; // 如果有验证类别名称唯一的需求，可用该API
import { useItemCategoryStore } from "@/stores/itemCategoryStore.ts"; // 使用货品类别Store
import { useAddOrEdit } from "@/stores/addOrEdit.ts"; // 如果有使用货品类别的store，可用此store

export function useItemCategoryFormValidation() {
    const ruleFormRef = ref<FormInstance>();
    const ruleForm = reactive({
        id: 0,
        itemCategoryName: '',
        itemCategoryDescription: '',
    });
    const itemCategoryStore = useItemCategoryStore(); // 如果有货品类别Store，可在此使用

    // 类别名的校验规则
    const checkItemCategoryName = async (rule: any, value: string, callback: Function) => {
        const addOrEdit = useAddOrEdit().addOrEdit;
        if (itemCategoryStore.currentItemCategory) {
            ruleForm.id = itemCategoryStore.currentItemCategory.id!;
            ruleForm.itemCategoryName = itemCategoryStore.currentItemCategory.itemCategoryName;
            ruleForm.itemCategoryDescription = itemCategoryStore.currentItemCategory.itemCategoryDescription;
        }
        console.log('这是value', value);
        console.log('这是ruleForm', ruleForm);
        console.log('这是addOrEdit', addOrEdit);

        if (!value) {
            return callback(new Error('类别名称不能为空'));
        }

        try {
            let response: any;
            if (addOrEdit === 'edit') {
                response = await getRequest(`/item-category/validate-item-category-name/update?itemCategoryName=${value}&itemCategoryId=${ruleForm.id}`);
            } else {
                response = await getRequest(`/item-category/validate-item-category-name/add?itemCategoryName=${value}`);
            }
            if (response.status === 409) {
                callback(new Error('类别名已存在'));
            } else {
                callback();
            }
        } catch (error: any) {
            console.error('这是error', error);
            if (error.response.status === 409) {
                callback(new Error('类别名已存在'));
            }
            callback(new Error('验证类别名时发生错误'));
        }
    };

    // 校验规则
    const rules = reactive<FormRules<typeof ruleForm>>({
        itemCategoryName: [
            { required: true, message: '类别名称不能为空', trigger: 'blur' },
            { asyncValidator: checkItemCategoryName, trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9\s\u4e00-\u9fa5-_]{3,50}$/, message: '类别名称只能包含字母、数字、汉字、空格、"-"和"_"，长度为3到50个字符', trigger: 'blur' }
        ],
        itemCategoryDescription: [
            { required: true, message: '描述不能为空', trigger: 'blur' },
            // 允许包含字母、数字、汉字、空格、"-"和"_"
            { pattern: /^[a-zA-Z0-9\s\u4e00-\u9fa5-_]{5,100}$/, message: '描述只能包含字母、数字、汉字、空格、"-"和"_"，长度为5到100个字符', trigger: 'blur' }
        ]
    });

    return { ruleFormRef, rules, ruleForm };
}
