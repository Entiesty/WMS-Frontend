import { deleteRequest } from "@/services/api.ts";

export function useStockTransactionDelete(fetchData: () => void) {
    const confirmDelete = async (id: number) => {
        try {
            await deleteRequest(`/stockTransaction/${id}`);  // 修改URL为库存交易的删除路径
            console.log(`StockTransaction with id ${id} deleted successfully.`);
            fetchData();  // 删除后刷新数据
        } catch (error) {
            console.error("Failed to delete stock transaction:", error);
        }
    };

    return { confirmDelete };
}
