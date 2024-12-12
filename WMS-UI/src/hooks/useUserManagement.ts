import { onMounted, reactive, ref } from "vue";
import { deleteRequest, getRequest, postRequest, putRequest } from "@/services/api.ts";
import type { User } from '@/types/Data.ts';
import type { FormInstance, FormRules } from "element-plus";
import {InfoFilled} from "@element-plus/icons-vue";

export function useUserList() {
    const records = ref<User[]>([]);
    const total = ref<number>(0);

    const queryPageParam = reactive({
        current: 1,
        size: 5,
    });

    const fetchUsers = async () => {
        try {
            const response = await postRequest('/user/list', queryPageParam);
            records.value = response.data.records;
            total.value = response.data.total;
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCurrentChange = async (val: number) => {
        queryPageParam.current = val;
        await fetchUsers(); // 等待 fetchUsers 完成
    };


    onMounted(fetchUsers);

    return { records, total, queryPageParam, fetchUsers, handleCurrentChange };
}

export function useUserEdit() {
    const editDialogFormVisible = ref<boolean>(false);
    const user = reactive<User>({
        createdAt: "", id: 0, password: "", role: "", status: "", updatedAt: "", userName: ""
    });

    const editUser = (row: User) => {
        Object.assign(user, row);
        editDialogFormVisible.value = true;
    };

    const confirmUpdate = async () => {
        const payload = {
            id: user.id,
            userName: user.userName,
            password: user.password,
            role: user.role,
            status: user.status,
        };

        try {
            await putRequest('/user', payload);
            console.log('User updated successfully.');
            editDialogFormVisible.value = false;
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const closeEditDialog = () => {
        editDialogFormVisible.value = false;
    };

    return { editDialogFormVisible, user, editUser, confirmUpdate, closeEditDialog };
}

export function useUserFormValidation() {
    const ruleFormRef = ref<FormInstance>();
    const ruleForm = reactive({
        userName: '',
        password: '',
    });

    const checkUserName = async (rule: any, value: string, callback: Function) => {
        if (!value) {
            return callback(new Error('用户名不能为空'));
        }
        try {
            const response = await getRequest(`/user/${value}`);
            if (!response.data) {
                callback();
            } else {
                callback(new Error('用户名已存在'));
            }
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                console.error('403 Forbidden: 登录状态失效或权限不足');
            }
            callback(new Error('验证用户名时发生错误'));
        }
    };

    const rules = reactive<FormRules<typeof ruleForm>>({
        userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { asyncValidator: checkUserName, trigger: 'blur' }
        ],
        password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { pattern: /^(?=.*\d).{8,}$/, message: '密码至少包含一个数字且至少八个字符', trigger: 'blur' }
        ]
    });

    return { ruleFormRef, rules };
}

export function useUserDelete(fetchUsers: () => void) {
    const confirmDelete = async (id: number) => {
        try {
            await deleteRequest(`/user/${id}`);
            console.log(`User with id ${id} deleted successfully.`);
            fetchUsers();
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    return { confirmDelete };
}

export function useUserStyle() {
    const InfoFilledIcon = InfoFilled;
    const formLabelWidth = ref<string>('80px');

    return { InfoFilledIcon, formLabelWidth };
}
