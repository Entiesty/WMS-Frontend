import { onMounted, reactive, ref } from "vue";
import { postRequest } from "@/services/api.ts";

// 泛型定义
export function usePagedData<T>(apiUrl: string, initialParams: object = {}) {
    const records = ref<T[]>([]);
    const total = ref<number>(0);

    // 当前页和每页数量
    const queryPageParam = reactive({
        current: 1,
        size: 5,
        ...initialParams,
    });

    // 获取数据的通用函数
    const fetchData = async () => {
        try {
            const response = await postRequest(apiUrl, queryPageParam);
            records.value = response.data.records;
            total.value = response.data.total;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // 页码变化时重新加载数据
    const handleCurrentChange = async (val: number) => {
        queryPageParam.current = val;
        await fetchData(); // 等待 fetchData 完成
    };

    // 在组件挂载时自动加载数据
    onMounted(fetchData);

    return { records, total, queryPageParam, fetchData, handleCurrentChange };
}
