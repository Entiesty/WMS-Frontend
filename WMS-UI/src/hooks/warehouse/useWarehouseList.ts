import type {User, Warehouse} from "@/types/Data.ts";
import {usePagedData} from "@/hooks/system/usePagedData.ts";

export function useWarehouseList() {
    const { records, total, queryPageParam
        , fetchData, handleCurrentChange } = usePagedData<Warehouse>("/warehouse/list");

    return { records, total, queryPageParam, fetchData, handleCurrentChange };
}