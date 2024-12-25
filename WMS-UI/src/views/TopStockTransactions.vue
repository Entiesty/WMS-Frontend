<template>
  <el-card>
    <div class="p-2 grid justify-center">
      <el-date-picker
          v-model="value"
          type="daterange"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
      />
    </div>

    <el-table :data="stockTransactionRankingData" style="width: 100%">
      <el-table-column prop="itemName" label="货品名称" align="center"/>
      <el-table-column prop="totalIn" label="总进货量" align="center"/>
      <el-table-column prop="totalOut" label="总出货量" align="center"/>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getRequest } from "@/services/api.ts";
import dayjs from "dayjs";

// 存储选择的日期范围
const startDate = ref('2024-01-01');
const endDate = ref('2025-01-01');

// 存储表格数据
const stockTransactionRankingData = ref([]);

// 格式化日期为 yyyy-MM-dd
const formatDate = (date: Date): string => {
  return dayjs(date).format('YYYY-MM-DD');
}

// 设置默认日期范围
const value = ref([new Date('2024-01-01'), new Date('2025-01-01')]);

// 处理日期范围变化，触发请求
const handleDateChange = async (newVal: [Date, Date]) => {
  if (newVal.length === 2) {
    const [start, end] = newVal;
    startDate.value = formatDate(start);
    endDate.value = formatDate(end);

    // 触发数据请求
    await fetchStockTransactionRankingData();
  }
};

// 获取数据的函数
const fetchStockTransactionRankingData = async () => {
  try {
    if (!startDate.value || !endDate.value) {
      console.log("请先选择有效的日期范围");
      return; // 如果日期为空，避免发送请求
    }

    const response = await getRequest(`/stockTransaction/top-stock-transactions?startDate=${encodeURIComponent(startDate.value)}&endDate=${encodeURIComponent(endDate.value)}`);
    console.log('response', response);
    stockTransactionRankingData.value = response.data;
  } catch (e) {
    console.error('Error fetching data:', e);
  }
};

// 页面加载时初始化数据
onMounted(() => {
  fetchStockTransactionRankingData();  // 默认值为 2024-01-01 到 2025-01-01
});
</script>

<style scoped>
</style>
