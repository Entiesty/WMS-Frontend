import {deleteRequest} from "@/services/api.ts";

export function useUserDelete(fetchUsers: () => void) {
    const confirmDelete = async (id: number) => {
        try {
            await deleteRequest(`/user/${id}`);
            console.log(`User with id ${id} deleted successfully.`);
            fetchUsers();
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    return {confirmDelete};
}