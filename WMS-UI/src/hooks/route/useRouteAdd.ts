import { reactive, ref } from "vue";
import { postRequest } from "@/services/api.ts"; // 引入post请求
import { useAddOrEdit } from "@/stores/addOrEdit.ts"; // 引入获取操作（添加或编辑）的 store

export function useRouteAdd() {
    const addDialogFormVisible = ref<boolean>(false); // 控制对话框的显示与隐藏
    const newRoute = reactive({
        name: '',         // 路由名称
        path: '',         // 路由路径
        parentName: '',      // 父级路由ID
        role: '',         // 角色
    }); // 用于存储新增路由的数据

    // 提交新增路由请求
    const addRoute = () => {
        const addOrEdit = useAddOrEdit();
        addDialogFormVisible.value = true;
        addOrEdit.setAddOrEdit('add');
    };

    function toLowerCaseFirstChar(str: string): string {
        if (str.length === 0) {
            return str;
        }
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    const confirmAddRoute = async () => {
        try {
            // 发送 post 请求以新增路由
            newRoute.path = toLowerCaseFirstChar(newRoute.name);
            const response = await postRequest('/route', newRoute);
            console.log('Route added successfully:', response);

            // 提交成功后，关闭表单对话框
            addDialogFormVisible.value = false;
            // 重置路由表单
            newRoute.name = '';
            newRoute.path = '';
            newRoute.parentName = '';
        } catch (error) {
            console.log(error);
            console.error('Failed to add route:', error);
        }
    };

    // 关闭对话框
    const closeAddDialog = () => {
        addDialogFormVisible.value = false;
    };

    return {
        addDialogFormVisible,
        newRoute,
        addRoute,
        confirmAddRoute,
        closeAddDialog
    };
}
