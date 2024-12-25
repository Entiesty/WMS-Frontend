<template>
  <div class="h-screen flex flex-col items-center justify-center p-4">
    <!-- 欢迎信息 -->
    <div class="mb-8">
      <span class="font-mono text-2xl font-bold text-orange-600">
        {{ 'Hello ' + authorizationStore.userName + ', 欢迎来到仓储管理系统' }}
      </span>
    </div>

    <!-- Element Plus 统计组件 -->
    <div class="flex gap-8 mb-8">
      <!-- 仓库信息卡片 -->
      <el-card class="w-64" shadow="hover">
        <div class="text-center">
          <h3 class="text-lg font-semibold mb-2">仓库总数</h3>
          <el-statistic :value="warehouseCount" :prefix="'仓库'" :precision="0" />
        </div>
      </el-card>

      <!-- 商品库存进度 -->
      <el-card class="w-64" shadow="hover">
        <div class="text-center">
          <h3 class="text-lg font-semibold mb-2">商品库存进度</h3>
          <el-progress :percentage="stockProgress" status="success" />
        </div>
      </el-card>

      <!-- 任务完成情况 -->
      <el-card class="w-64" shadow="hover">
        <div class="text-center">
          <h3 class="text-lg font-semibold mb-2">今日任务完成</h3>
          <el-progress :percentage="taskCompletion" status="exception" />
        </div>
      </el-card>
    </div>

    <!-- 数据统计表格 -->
    <el-card class="h-64 w-2/3" shadow="hover">
      <el-table :data="tableData" class="w-full max-w-4xl" border fit>
        <el-table-column label="商品名称" prop="itemName" align="center" />
        <el-table-column label="库存" prop="stock" align="center"/>
        <el-table-column label="出入库数量" prop="quantity" align="center"/>
      </el-table>
    </el-card>

    <!-- 折线图容器 -->
    <div class="mt-8 h-96 w-full max-w-4xl" ref="lineChartRef"></div>
  </div>
</template>

<script setup lang="ts">
import {useAuthorizationStore} from "@/stores/authorizationStore.ts";
import {ref, onMounted} from 'vue';
import * as echarts from 'echarts';

// 获取授权存储的数据
const authorizationStore = useAuthorizationStore();

// 写死的数据
const warehouseCount = ref(5); // 假设有5个仓库
const stockProgress = ref(85); // 假设商品库存进度为85%
const taskCompletion = ref(60); // 假设今日任务完成度为60%

// 模拟的表格数据
const tableData = ref([
  { itemName: 'REDMI K80 Pro', stock: 120, quantity: 35 },
  { itemName: 'Xiaomi 15 Pro', stock: 200, quantity: 80 },
  { itemName: '米家净水器1000G Pro', stock: 50, quantity: 10 },
  { itemName: '小米智能门锁2 Pro', stock: 500, quantity: 120 },
]);

// 折线图容器引用
const lineChartRef = ref(null);

// 初始化折线图
const initLineChart = () => {
  const chart = echarts.init(lineChartRef.value);
  chart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '出入库数量',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230]
    }],
    seriesData: [
      {
        name: '出入库数量',
        type: 'line',
        data: []
      },
    ],
  });
};

onMounted(() => {
  if (lineChartRef.value) {
    initLineChart();
  }
});
</script>

<style scoped>
/* 根据需要添加样式 */
</style>