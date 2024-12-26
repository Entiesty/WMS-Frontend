import { deleteRequest } from "@/services/api.ts";

export function useRouteDelete(fetchData: () => void) {
    const confirmDelete = async (id: number) => {
        try {
            // 发送删除请求
            await deleteRequest(`/route/${id}`);
            console.log(`Route with id ${id} deleted successfully.`);
            // 删除成功后刷新路由列表
            fetchData();
        } catch (error) {
            console.error("Failed to delete route:", error);
        }
    };

    return { confirmDelete };
}
