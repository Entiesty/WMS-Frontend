<template>
  <el-card style="">
    <el-table :data="records" border fit>
      <el-table-column prop="id" label="Id" align="center"/>
      <el-table-column prop="userName" label="UserName" align="center"/>
      <el-table-column prop="password" label="Password" align="center"/>
      <el-table-column prop="role" label="Role" align="center"/>
      <el-table-column prop="status" label="Status" align="center"/>
      <el-table-column prop="createdAt" label="CreatedAt" align="center"/>
      <el-table-column prop="updatedAt" label="UpdatedAt" align="center"/>
      <el-table-column label="Actions" align="center"/>
    </el-table>

    <el-pagination
        background
        :total="total"
        v-model:current-page="queryPageParam.current"
        @update:current-page="handleCurrentChange"
        v-model:page-size="queryPageParam.size"
        layout="jumper, prev, pager, next"
        style="margin-top: 20px;"
    />
  </el-card>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {postRequest} from "@/services/api.ts";

const records = ref([]);
const total = ref<number>(0);

interface QueryPageParam {
  current: number;
  size: number;
}

const queryPageParam = reactive<QueryPageParam>({
  current: 1,
  size: 5,
});

const fetchUsers = async () => {
  try {
    const response = await postRequest('/user/list',
        queryPageParam);
    records.value = response.data.records;
    total.value = response.data.total;
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};


onMounted(() => {
  fetchUsers();
})

const handleCurrentChange = (val: number) => {
  queryPageParam.current = val;
  fetchUsers();
}

</script>

<style scoped>

</style>
