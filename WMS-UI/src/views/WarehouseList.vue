<template>
  <el-card>
    <el-button type="primary" @click="addWarehouse">新增</el-button>
    <el-select
        v-model="selectColumn">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      ></el-option>
    </el-select>
    <el-input v-model="searchQuery" size="small" placeholder="Type to search" />
    <el-table :data="filteredRecords" border fit>
      <el-table-column prop="id" label="Id" align="center"/>
      <el-table-column prop="warehouseName" label="warehouseName" align="center"/>
      <el-table-column prop="location" label="location" align="center"/>
      <el-table-column prop="createdAt" label="CreatedAt" align="center"/>
      <el-table-column prop="updatedAt" label="UpdatedAt" align="center"/>
      <el-table-column label="Actions" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editWarehouse(scope.row)">编辑</el-button>
          <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              :icon="InfoFilledIcon"
              icon-color="#626AEF"
              title="确定要删除该仓库吗？"
              @confirm="confirmDelete(scope.row.id)"
              :hide-after=100
          >
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
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

  <el-dialog
  v-model="addDialogFormVisible"
  title="新增仓库信息">
    <el-form :model="newWarehouse" :rules="rules" ref="ruleFormRef" label-width="120px">
      <el-form-item label="仓库名称" prop="warehouseName">
        <el-input v-model="newWarehouse.warehouseName" placeholder="请输入仓库名称" />
      </el-form-item>
      <el-form-item label="仓库位置" prop="location">
        <el-input v-model="newWarehouse.location" placeholder="请输入仓库位置" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="closeAddDialog">取消</el-button>
      <el-button type="primary" @click="validateBeforeSubmit">确认</el-button>
    </template>
  </el-dialog>

  <el-dialog
      v-model="editDialogFormVisible"
      title="修改用户信息">
    <el-form :model="warehouse" :rules="rules" ref="ruleFormRef" status-icon>
      <el-form-item label="仓库名" :label-width="formLabelWidth" prop="warehouseName">
        <el-input v-model="warehouse.warehouseName"/>
      </el-form-item>
      <el-form-item label="位置" :label-width="formLabelWidth" prop="location">
        <el-input v-model="warehouse.location"/>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="closeEditDialog">取消</el-button>
      <el-button type="primary" @click="validateBeforeSubmit">保存</el-button>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import {useWarehouseList} from "@/hooks/warehouse/useWarehouseList.ts";
import {useStyle} from "@/hooks/system/useStyle.ts";
import {useWarehouseEdit} from "@/hooks/warehouse/useWarehouseEdit.ts";
import {useWarehouseDelete} from "@/hooks/warehouse/useWarehouseDelete.ts";
import {useWarehouseAdd} from "@/hooks/warehouse/useWarehouseAdd.ts";
import {useWarehouseFormValidation} from "@/hooks/warehouse/useWarehouseFormValidation.ts";
import {computed, ref} from "vue";

// 使用用户列表相关逻辑
const {records, total, queryPageParam, fetchData, handleCurrentChange} = useWarehouseList();
const {InfoFilledIcon, formLabelWidth} = useStyle();
const {editDialogFormVisible, warehouse, editWarehouse, confirmUpdate, closeEditDialog} = useWarehouseEdit();
const {confirmDelete} = useWarehouseDelete(fetchData);
const {addDialogFormVisible, newWarehouse, addWarehouse, confirmAddWarehouse, closeAddDialog} = useWarehouseAdd();
const {ruleFormRef, rules} = useWarehouseFormValidation();

const validateBeforeSubmit = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if(editDialogFormVisible.value)
        await confirmUpdate();
      else{
        await confirmAddWarehouse();
      }
      await fetchData();
    } else {
      console.log("Validation failed");
    }
  });
};

const searchQuery = ref<string>('');
const selectColumn = ref<string>('warehouseName')
const filteredRecords = computed(() => {
  if (!searchQuery.value) {
    return records.value;
  }
  if(selectColumn.value === 'warehouseName')
    return records.value.filter(record => {
      return record.warehouseName.toString().toLowerCase().includes(searchQuery.value.toLowerCase());
    });
  else if(selectColumn.value === 'location')
    return records.value.filter(record => {
      return record.location.toString().toLowerCase().includes(searchQuery.value.toLowerCase());
    });
});

const options = [
  {
    value: 'warehouseName',
    label: '仓库名称'
  },
  {
    value: 'location',
    label: '位置'
  }
];

</script>

<style scoped>

</style>
