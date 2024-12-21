import { deleteRequest } from "@/services/api.ts";

export function useItemDelete(fetchData: () => void) {
    const confirmDelete = async (id: number) => {
        try {
            await deleteRequest(`/item/${id}`);
            console.log(`Item with id ${id} deleted successfully.`);
            fetchData();
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };

    return { confirmDelete };
}
