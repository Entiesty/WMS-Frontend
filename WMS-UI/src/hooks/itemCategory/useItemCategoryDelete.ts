import { deleteRequest } from "@/services/api.ts";

export function useItemCategoryDelete(fetchData: () => void) {
    const confirmDelete = async (id: number) => {
        try {
            await deleteRequest(`/item-category/${id}`);
            console.log(`Item category with id ${id} deleted successfully.`);
            fetchData();  // 调用传入的 fetchData 函数刷新数据
        } catch (error) {
            console.error("Failed to delete item category:", error);
        }
    };

    return { confirmDelete };
}
