import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { useAuthorizationStore } from "@/stores/authorizationStore.ts";
import {getRequest} from "@/services/api.ts";

export function useMenu() {
    const router = useRouter();
    const authorizationStore = useAuthorizationStore();

    const handleMenuSelect = (index: string) => {
        switch (index) {
            case '0':
                void router.push("/SuperAdminDashboard/mainContent");
                break;
            case '1-1':
                void router.push("/SuperAdminDashboard/userList");
                break;
            case '2-1':
                void router.push("/SuperAdminDashboard/personalInformation");
                break;
            case '3-1':
                void router.push("/SuperAdminDashboard/enterpriseInformation");
                break;
            case '4-1':
                void router.push("/SuperAdminDashboard/warehouseList");
                break;
            case '5-1':
                void router.push("/SuperAdminDashboard/itemCategoryList");
                break;
            case '5-2':
                void router.push("/SuperAdminDashboard/itemList");
                break;
            case '6-1':
                void router.push("/SuperAdminDashboard/stockTransactionList");
                break;
            case '7-1':
                void router.push("/SuperAdminDashboard/routeList");
                break;
            case '8-1':
                void router.push("/SuperAdminDashboard/stockFlowChart");
                break;
            case '8-2':
                void router.push("/SuperAdminDashboard/topStockTransactions");
                break;
            default:
                console.warn(`Unhandled menu index: ${index}`);
        }
    };

    const handleLogout = async () => {
        try {
            await ElMessageBox.confirm(
                "确定要退出登录吗？",
                "提示",
                {
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            );

            // 调用后端注销接口
            await getRequest("/authorization/logout");

            // 执行登出逻辑
            authorizationStore.clearToken(); // 清除 token
            authorizationStore.clearRole(); // 清除角色
            authorizationStore.clearRoutes();
            await router.push("/"); // 跳转到首页


            console.log("User logged out");
        } catch (error) {
            // 如果用户取消登出或者请求失败
            console.log("User canceled logout or logout failed", error);
        }
    };


    return { handleMenuSelect, handleLogout };
}
