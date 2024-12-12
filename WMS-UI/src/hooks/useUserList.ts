import {onMounted, reactive, ref} from "vue";
import type {User} from "@/types/Data.ts";
import {postRequest} from "@/services/api.ts";

export function useUserList() {
    const records = ref<User[]>([]);
    const total = ref<number>(0);

    const queryPageParam = reactive({
        current: 1,
        size: 5,
    });

    const fetchUsers = async () => {
        try {
            const response = await postRequest('/user/list', queryPageParam);
            records.value = response.data.records;
            total.value = response.data.total;
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCurrentChange = async (val: number) => {
        queryPageParam.current = val;
        await fetchUsers(); // 等待 fetchUsers 完成
    };


    onMounted(fetchUsers);

    return {records, total, queryPageParam, fetchUsers, handleCurrentChange};
}