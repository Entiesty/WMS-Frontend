import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { getRequest } from "@/services/api.ts";
import { useAddOrEdit } from "@/stores/addOrEdit.ts";
import { useRouteStore } from "@/stores/routeStore.ts"; // 假设你有一个 routeStore

export function useRouteFormValidation() {
    const ruleFormRef = ref<FormInstance>();
    const ruleForm = reactive({
        id: 0,
        name: '',
        path: '',
    });

    const routeStore = useRouteStore(); // 获取当前路由数据

    // 路由名称的异步验证
    const checkRouteName = async (rule: any, value: string, callback: Function) => {
        const addOrEdit = useAddOrEdit().addOrEdit;

        if (routeStore.currentRoute) {
            ruleForm.id = routeStore.currentRoute.id;
            ruleForm.name = routeStore.currentRoute.name;
            ruleForm.path = routeStore.currentRoute.path;
        }

        if (!value) {
            return callback(new Error('路由名称不能为空'));
        }

        try {
            let response: any;
            if (addOrEdit === 'edit') {
                response = await getRequest(`/route/validate-route-name/update?routeName=${value}&routeId=${ruleForm.id}`);
            } else {
                response = await getRequest(`/route/validate-route-name/add?routeName=${value}`);
            }

            if (response.status === 409) {
                callback(new Error('路由名称已存在'));
            } else {
                callback();
            }
        } catch (error: any) {
            console.error('验证路由名称时发生错误', error);
            if (error.response.status === 409) {
                callback(new Error('路由名称已存在'));
            }
            callback(new Error('验证路由名称时发生错误'));
        }
    };

    const rules = reactive<FormRules<typeof ruleForm>>({
        name: [
            { required: true, message: '路由名称不能为空', trigger: 'blur' },
            { asyncValidator: checkRouteName, trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9-_]{3,32}$/, message: '路由名称只能包含字母、数字、短横线和下划线，长度为3到32个字符', trigger: 'blur' },
        ],
        path: [
            { required: true, message: '路径不能为空', trigger: 'blur' },
            { pattern: /^\/[a-zA-Z0-9-_/]+$/, message: '路径格式不正确', trigger: 'blur' },
        ],
    });

    return { ruleFormRef, rules, ruleForm };
}
