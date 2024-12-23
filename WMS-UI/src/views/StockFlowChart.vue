<template>
  <el-date-picker
      v-model="value"
      type="daterange"
      range-separator="To"
      start-placeholder="Start date"
      end-placeholder="End date"
  />
  <div ref="dailyStockChart" style="width: 100%; height: 400px;"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { getRequest } from "@/services/api.js";
import dayjs from 'dayjs';

// 定义返回数据项的类型
interface StockData {
  date: string;
  totalIn: number;
  totalOut: number;
}

// 定义图表数据的类型
interface ChartData {
  xAxisData: string[];
  seriesData: Array<{
    name: string;
    type: string;
    data: number[];
  }>;
}

// 格式化日期为 yyyy-MM-dd
const formatDate = (date: Date): string => {
  return dayjs(date).format('YYYY-MM-DD');
}

// 获取入库数据的异步函数
const fetchDailyInStockData = async (startDate: string, endDate: string): Promise<StockData[] | null> => {
  try {
    const response = await getRequest(`/api/statistics/daily-in-stock?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`);
    console.log('Fetched daily in stock data:', response);
    return response.data;  // 假设返回的数据结构包含 'data' 数组
  } catch (error) {
    console.error('Error fetching daily in stock data:', error);
    return null;
  }
};

// 获取出库数据的异步函数
const fetchDailyOutStockData = async (startDate: string, endDate: string): Promise<StockData[] | null> => {
  try {
    const response = await getRequest(`/api/statistics/daily-out-stock?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`);
    console.log('Fetched daily out stock data:', response);
    return response.data;  // 假设返回的数据结构包含 'data' 数组
  } catch (error) {
    console.error('Error fetching daily out stock data:', error);
    return null;
  }
};

const value = ref([]);  // 绑定日期选择器的值
const dailyStockChart = ref<HTMLElement | null>(null);  // 引用图表的 DOM 元素，允许为 null

// 初始化图表数据结构并显式指定类型
const chartData = ref<ChartData>({
  xAxisData: [],
  seriesData: [
    {
      name: '总入库',
      type: 'line',
      data: []
    },
    {
      name: '总出库',
      type: 'line',
      data: []
    }
  ],
});

// 存储选择的日期范围
const startDate = ref('');
const endDate = ref('');

// 监听日期选择器的变化
watch(value, async (newVal) => {
  if (newVal.length === 2) {
    const [start, end] = newVal;
    startDate.value = formatDate(start);  // 格式化开始日期
    endDate.value = formatDate(end);  // 格式化结束日期

    // 通过新选择的日期范围获取入库和出库数据
    const [inData, outData] = await Promise.all([
      fetchDailyInStockData(startDate.value, endDate.value),
      fetchDailyOutStockData(startDate.value, endDate.value)
    ]);

    if (inData && outData) {
      const xAxisData = inData.map((item: StockData) => item.date);  // 获取日期
      const totalInData = inData.map((item: StockData) => item.totalIn);  // 获取入库数量
      const totalOutData = outData.map((item: StockData) => item.totalOut);  // 获取出库数量

      // 更新图表数据
      chartData.value.xAxisData = xAxisData;
      chartData.value.seriesData[0].data = totalInData;
      chartData.value.seriesData[1].data = totalOutData;

      // 检查 dailyStockChart.value 是否为 null，并强制类型转换为 HTMLElement
      if (dailyStockChart.value) {
        let myChart = echarts.getInstanceByDom(dailyStockChart.value as HTMLElement);
        if (!myChart) {
          // 如果没有实例，初始化图表
          myChart = echarts.init(dailyStockChart.value as HTMLElement);
        }

        // 设置图表的配置项
        myChart.setOption({
          title: {
            text: '每天货品进出情况'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['总入库', '总出库']
          },
          xAxis: {
            type: 'category',
            data: chartData.value.xAxisData
          },
          yAxis: {
            type: 'value'
          },
          series: chartData.value.seriesData
        });
      }
    }
  }
});

// 在组件挂载后初始渲染图表
onMounted(async () => {
  if (startDate.value && endDate.value) {
    const [inData, outData] = await Promise.all([
      fetchDailyInStockData(startDate.value, endDate.value),
      fetchDailyOutStockData(startDate.value, endDate.value)
    ]);

    if (inData && outData) {
      const xAxisData = inData.map((item: StockData) => item.date);
      const totalInData = inData.map((item: StockData) => item.totalIn);
      const totalOutData = outData.map((item: StockData) => item.totalOut);

      chartData.value.xAxisData = xAxisData;
      chartData.value.seriesData[0].data = totalInData;
      chartData.value.seriesData[1].data = totalOutData;

      if (dailyStockChart.value) {
        let myChart = echarts.getInstanceByDom(dailyStockChart.value as HTMLElement);
        if (!myChart) {
          myChart = echarts.init(dailyStockChart.value as HTMLElement);
        }

        myChart.setOption({
          title: {
            text: '每天货品进出情况'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['总入库', '总出库']
          },
          xAxis: {
            type: 'category',
            data: chartData.value.xAxisData
          },
          yAxis: {
            type: 'value'
          },
          series: chartData.value.seriesData
        });
      }
    }
  }
});
</script>
