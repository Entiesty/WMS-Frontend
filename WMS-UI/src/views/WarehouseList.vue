<template>
  <el-card>
    <!-- 使用 el-row 和 el-col 创建顶部工具栏布局 -->
    <el-row class="toolbar" justify="center">
      <el-col :span="4">
        <!-- 搜索框 -->
        <el-input v-model="searchQuery" size="small" placeholder="Type to search" clearable />
      </el-col>
      <el-col :span="2">
        <!-- 下拉选择框 -->
        <el-select v-model="selectColumn" size="small" placeholder="选择列">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <!-- 新增按钮 -->
        <el-button type="primary" @click="addWarehouse" block>新增</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="filteredRecords" border fit>
      <el-table-column prop="id" label="Id" align="center"/>
      <el-table-column prop="warehouseName" label="仓库名称" align="center"/>
      <el-table-column prop="location" label="位置" align="center"/>
      <el-table-column prop="createdAt" label="创建时间" align="center"/>
      <el-table-column prop="updatedAt" label="更新时间" align="center"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editWarehouse(scope.row)">编辑</el-button>
          <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              :icon="InfoFilledIcon"
              icon-color="#626AEF"
              title="确定要删除该仓库吗？"
              @confirm="confirmDelete(scope.row.id)"
              :hide-after="100"
          >
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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

  <!-- 新增仓库对话框 -->
  <el-dialog v-model="addDialogFormVisible" title="新增仓库信息">
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

  <!-- 编辑仓库对话框 -->
  <el-dialog v-model="editDialogFormVisible" title="修改仓库信息">
    <el-form :model="warehouse" :rules="rules" ref="ruleFormRef" status-icon>
      <el-form-item label="仓库名称" :label-width="formLabelWidth" prop="warehouseName">
        <el-input v-model="warehouse.warehouseName"/>
      </el-form-item>
      <el-form-item label="仓库位置" :label-width="formLabelWidth" prop="location">
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

// 使用仓库列表相关逻辑
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
      if (editDialogFormVisible.value)
        await confirmUpdate();
      else {
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
  if (selectColumn.value === 'warehouseName')
    return records.value.filter(record => {
      return record.warehouseName.toString().toLowerCase().includes(searchQuery.value.toLowerCase());
    });
  else if (selectColumn.value === 'location')
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
.toolbar {
  margin-bottom: 20px;
}

.el-row {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.el-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-input, .el-select {
  width: 100%;
}

.el-col .el-button {
  margin-right: 10px;
}

.el-button[block] {
  width: 100%;
}

/* 确保新增按钮和搜索框在同一行居中 */
.toolbar .el-col {
  padding: 10px;
}
</style>
