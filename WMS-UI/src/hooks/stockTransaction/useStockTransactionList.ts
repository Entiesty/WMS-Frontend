import type { StockTransaction } from "@/types/Data.ts";
import { usePagedData } from "@/hooks/system/usePagedData.ts";

export function useStockTransactionList() {
    // 使用分页数据钩子
    const { records, total, queryPageParam, fetchData, handleCurrentChange } = usePagedData<StockTransaction>("/stockTransaction/list");

    return { records, total, queryPageParam, fetchData, handleCurrentChange };
}
