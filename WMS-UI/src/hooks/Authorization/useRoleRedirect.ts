// src/hooks/useRoleRedirect.ts
import { useRouter } from "vue-router";

export function useRoleRedirect() {
    const router = useRouter();

    // 根据角色返回对应的路径
    const getRedirectPathByRole = (role: string): string => {
        const roleRedirectMap: { [key: string]: string } = {
            'super_admin': '/SuperAdminDashboard',
            'information_manager': '/InformationManagerDashboard',
            // 其他角色及对应的路径
        };

        return roleRedirectMap[role] || '/';  // 默认跳转路径
    };

    // 跳转到对应页面
    const redirectToRolePage = async (role: string) => {
        const redirectPath = getRedirectPathByRole(role);
        if (redirectPath) {
            await router.push({ path: redirectPath });
        } else {
            console.error(`${role} 路由未找到`);
        }
    };

    return { getRedirectPathByRole, redirectToRolePage };
}
