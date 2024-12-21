import type { Item } from "@/types/Data.ts";
import { usePagedData } from "@/hooks/system/usePagedData.ts";

export function useItemList() {
    const { records, total, queryPageParam, fetchData, handleCurrentChange } = usePagedData<Item>("/item/list");

    return { records, total, queryPageParam, fetchData, handleCurrentChange };
}
