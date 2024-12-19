import {reactive, ref} from "vue";
import type {FormInstance, FormRules} from "element-plus";
import {getRequest} from "@/services/api.ts";
import {useUserStore} from "@/stores/userStore.ts";
import {useAddOrEdit} from "@/stores/addOrEdit.ts";

export function useUserFormValidation() {
    const ruleFormRef = ref<FormInstance>();
    const ruleForm = reactive({
        id: 0,
        userName: '',
        password: '',
    });
    const userStore = useUserStore();
    const addOrEdit = useAddOrEdit().addOrEdit;

    const checkUserName = async (rule: any, value: string, callback: Function) => {
        if (userStore.currentUser) {
            ruleForm.id = userStore.currentUser.id;
            ruleForm.userName = userStore.currentUser.userName;
            ruleForm.password = userStore.currentUser.password;
        }
        console.log('这是value', value);

        if (!value) {
            return callback(new Error('用户名不能为空'));
        }

        try {
            let response:any;
            if(addOrEdit === 'edit') {
                response = await getRequest(`/user/validate-username/update?userName=${value}&userId=${ruleForm.id}`);
            }
            else {
                response = await getRequest(`/user/validate-username/add?userName=${value}`);
            }
            if (response.status === 409) {
                callback(new Error('用户名已存在'));
            } else {
                callback();
            }
        } catch (error: any) {
            console.error('这是error', error);
            if(error.response.status === 409){
                callback(new Error('用户名已存在'));
            }
            callback(new Error('验证用户名时发生错误'));
        }
    };

    const rules = reactive<FormRules<typeof ruleForm>>({
        userName: [
            {required: true, message: '用户名不能为空', trigger: 'blur'},
            {asyncValidator: checkUserName, trigger: 'blur'},
            {pattern: /^[a-zA-Z0-9]{3,16}$/, message: '用户名只能包含字母和数字，长度为3到16个字符', trigger: 'blur'}
        ],
        password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {pattern: /^(?=.*\d).{8,}$/, message: '密码至少包含一个数字且至少八个字符', trigger: 'blur'}
        ]
    });

    return {ruleFormRef, rules, ruleForm};
}
