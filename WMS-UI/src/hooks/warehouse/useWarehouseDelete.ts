import {deleteRequest} from "@/services/api.ts";

export function useWarehouseDelete(fetchData: () => void) {
    const confirmDelete = async (id: number) => {
        try {
            await deleteRequest(`/warehouse/${id}`);
            console.log(`warehouse with id ${id} deleted successfully.`);
            fetchData();
        } catch (error) {
            console.error("Failed to delete warehouse:", error);
        }
    };

    return {confirmDelete};
}


