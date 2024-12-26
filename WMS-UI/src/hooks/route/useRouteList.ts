import type { Route } from "@/types/Data.ts"; // 假设你定义了 Route 类型
import { usePagedData } from "@/hooks/system/usePagedData.ts";

export function useRouteList() {
    // 使用 usePagedData 钩子获取分页数据
    const { records, total, queryPageParam, fetchData, handleCurrentChange } = usePagedData<Route>("/route/list");

    return { records, total, queryPageParam, fetchData, handleCurrentChange };
}
