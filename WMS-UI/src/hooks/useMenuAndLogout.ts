import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { useAuthStore } from "@/stores/authStore.ts";

export function useMenuAndLogout() {
    const router = useRouter();
    const authStore = useAuthStore();

    const handleMenuSelect = (index: string) => {
        switch (index) {
            case "1-1":
                void router.push("/userList");
                break;
            // 可以根据需要添加更多菜单选项
            default:
                console.warn(`Unhandled menu index: ${index}`);
        }
    };

    const handleLogout = () => {
        ElMessageBox.confirm(
            "确定要退出登录吗？",
            "提示",
            {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
            }
        )
            .then(() => {
                // 执行登出逻辑
                authStore.clearToken();
                router.push("/");
                console.log("User logged out");
            })
            .catch(() => {
                console.log("User canceled logout");
            });
    };

    return { handleMenuSelect, handleLogout };
}
