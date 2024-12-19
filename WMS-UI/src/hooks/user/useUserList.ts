import type {User} from "@/types/Data.ts";
import {usePagedData} from "@/hooks/system/usePagedData.ts";

export function useUserList() {
    const { records, total, queryPageParam
        , fetchData, handleCurrentChange } = usePagedData<User>("/user/list");

    return { records, total, queryPageParam, fetchData, handleCurrentChange };
}
