import { reactive, ref } from "vue";
import type { Route } from "@/types/Data.ts";
import { putRequest } from "@/services/api.ts";
import { useRouteList } from "@/hooks/route/useRouteList.ts";  // 假设你有类似的钩子来获取路由列表
import { useRouteStore } from "@/stores/routeStore.ts";  // 假设你有路由管理的 store
import { useAddOrEdit } from "@/stores/addOrEdit.ts";  // 假设你有一个通用的状态管理 store 用于区分添加或编辑操作
import { ElMessage } from "element-plus";  // 引入提示框

export function useRouteEdit() {
    const editDialogFormVisible = ref<boolean>(false);  // 控制编辑对话框显示与否
    const route = reactive<Route>({
        id: 0,
        name: "",
        path: "",
        parentName: '',
        role: ''
    });
    const { fetchData } = useRouteList();  // 获取路由列表
    const routeStore = useRouteStore();  // 获取路由管理的 store

    function toLowerCaseFirstChar(str: string): string {
        if (str.length === 0) {
            return str;
        }
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    const editRoute = (row: Route) => {
        const addOrEdit = useAddOrEdit();
        routeStore.setCurrentRoute(row);  // 将当前编辑的路由存储到 store 中
        Object.assign(route, row);  // 复制路由数据到编辑对象
        editDialogFormVisible.value = true;  // 显示编辑对话框
        addOrEdit.setAddOrEdit('edit');  // 设置为编辑状态
    };

    const confirmUpdate = async () => {
        const payload = {
            id: route.id,
            name: route.name,
            path: route.path,
            parentName: route.parentName,
            role: route.role,
        };

        try {
            payload.path = toLowerCaseFirstChar(payload.name);
            await putRequest('/route', payload);  // 调用接口更新路由
            ElMessage.success('路由更新成功');
            editDialogFormVisible.value = false;  // 关闭编辑对话框
            await fetchData();  // 刷新路由列表数据
        } catch (error) {
            console.error('更新路由失败:', error);
            ElMessage.error('更新路由失败，请重试');
        }
    };

    const closeEditDialog = () => {
        editDialogFormVisible.value = false;  // 关闭编辑对话框
    };

    return { editDialogFormVisible, route, editRoute, confirmUpdate, closeEditDialog };
}
