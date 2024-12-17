import {reactive, ref} from "vue";
import type {FormInstance, FormRules} from "element-plus";
import {getRequest} from "@/services/api.ts";

export function useUserFormValidation(initialId?: number) {
    const ruleFormRef = ref<FormInstance>();
    const ruleForm = reactive({
        id: initialId,
        userName: '',
        password: '',
    });

    const checkUserName = async (rule: any, value: string, callback: Function) => {
        if (!value) {
            return callback(new Error('用户名不能为空'));
        }
        try {
            const response = await getRequest(`/user/validate-username
            ?username=${value}&userId=${initialId}`);
            if (response.status === 409) {
                callback(new Error('用户名已存在'));
            } else {
                callback();
            }
        } catch (error: any) {
            callback(new Error('验证用户名时发生错误'));
        }
    };

    const rules = reactive<FormRules<typeof ruleForm>>({
        userName: [
            {required: true, message: '用户名不能为空', trigger: 'blur'},
            {asyncValidator: checkUserName, trigger: 'blur'}
        ],
        password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {pattern: /^(?=.*\d).{8,}$/, message: '密码至少包含一个数字且至少八个字符', trigger: 'blur'}
        ]
    });

    return {ruleFormRef, rules, ruleForm};
}
