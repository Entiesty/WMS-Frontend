import { deleteRequest } from "@/services/api.ts";

// 通用的 useDelete hook
export function useDelete<T>(entityName: string, fetchData: () => void) {
    // 删除操作
    const confirmDelete = async (id: number) => {
        try {
            // 删除请求
            await deleteRequest(`/${entityName}/${id}`);
            console.log(`${entityName} with id ${id} deleted successfully.`);
            fetchData(); // 删除后刷新数据
        } catch (error) {
            console.error(`Failed to delete ${entityName} with id ${id}:`, error);
        }
    };

    return { confirmDelete };
}
