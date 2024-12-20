import type { ItemCategory } from "@/types/Data.ts";
import { usePagedData } from "@/hooks/system/usePagedData.ts";

export function useItemCategoryList() {
    const { records, total, queryPageParam, fetchData, handleCurrentChange } = usePagedData<ItemCategory>("/item-category/list");

    return { records, total, queryPageParam, fetchData, handleCurrentChange };
}
