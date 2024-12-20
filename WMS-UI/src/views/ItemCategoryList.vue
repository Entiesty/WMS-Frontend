<template>
  <el-card>
    <el-button type="primary" @click="addItemCategory">新增类别</el-button>
    <el-select v-model="selectColumn">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      ></el-option>
    </el-select>
    <el-input v-model="searchQuery" size="small" placeholder="Type to search" />
    <el-table :data="filteredItemCategories" border fit>
      <el-table-column prop="id" label="Id" align="center"/>
      <el-table-column prop="itemCategoryName" label="类别名称" align="center"/>
      <el-table-column prop="itemCategoryDescription" label="描述" align="center"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editItemCategory(scope.row)">编辑</el-button>
          <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              :icon="InfoFilledIcon"
              icon-color="#626AEF"
              title="确定要删除该类别吗？"
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

  <!-- 添加类别对话框 -->
  <el-dialog v-model="addDialogFormVisible" title="添加类别">
    <el-form :model="newItemCategory" :rules="rules" ref="ruleFormRef" status-icon>
      <el-form-item label="类别名称" :label-width="formLabelWidth" prop="itemCategoryName">
        <el-input v-model="newItemCategory.itemCategoryName" placeholder="请输入类别名称"/>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth" prop="itemCategoryDescription">
        <el-input v-model="newItemCategory.itemCategoryDescription" placeholder="请输入类别描述"/>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="closeAddDialog">取消</el-button>
      <el-button type="primary" @click="validateBeforeSubmit">确认</el-button>
    </template>
  </el-dialog>

  <!-- 编辑类别对话框 -->
  <el-dialog v-model="editDialogFormVisible" title="编辑类别">
    <el-form :model="itemCategory" :rules="rules" ref="ruleFormRef" status-icon>
      <el-form-item label="类别名称" :label-width="formLabelWidth" prop="itemCategoryName">
        <el-input v-model="itemCategory.itemCategoryName"/>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth" prop="itemCategoryDescription">
        <el-input v-model="itemCategory.itemCategoryDescription"/>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="closeEditDialog">取消</el-button>
      <el-button type="primary" @click="validateBeforeSubmit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElButton, ElTable, ElTableColumn, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElPopconfirm, ElPagination } from 'element-plus'
import { useItemCategoryList } from "@/hooks/itemCategory/useItemCategoryList";
import { useItemCategoryAdd } from "@/hooks/itemCategory/useItemCategoryAdd";
import { useItemCategoryEdit } from "@/hooks/itemCategory/useItemCategoryEdit";
import { useItemCategoryDelete } from "@/hooks/itemCategory/useItemCategoryDelete";
import { useItemCategoryFormValidation } from "@/hooks/itemCategory/useItemCategoryFormValidation";
import { useStyle } from "@/hooks/system/useStyle"

const { records, total, queryPageParam, fetchData, handleCurrentChange } = useItemCategoryList()

const { editDialogFormVisible, itemCategory, editItemCategory, confirmUpdate, closeEditDialog } = useItemCategoryEdit()

const { ruleFormRef, rules } = useItemCategoryFormValidation()

const { confirmDelete } = useItemCategoryDelete(fetchData)

const { addDialogFormVisible, newItemCategory, addItemCategory, confirmAddItemCategory, closeAddDialog } = useItemCategoryAdd()

const { InfoFilledIcon, formLabelWidth } = useStyle()

const validateBeforeSubmit = () => {
  if (!ruleFormRef.value) return
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (editDialogFormVisible.value)
        await confirmUpdate()
      else {
        await confirmAddItemCategory()
      }
      await fetchData()
    } else {
      console.log("Validation failed")
    }
  })
}

const searchQuery = ref<string>('')

const selectColumn = ref<string>('name')

const filteredItemCategories = computed(() => {
  if (!searchQuery.value) {
    return records.value
  }
  if (selectColumn.value === 'name')
    return records.value.filter(record => record.itemCategoryName.toLowerCase().includes(searchQuery.value.toLowerCase()))
  else if (selectColumn.value === 'description')
    return records.value.filter(record => record.itemCategoryDescription.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const options = [
  { value: 'name', label: '类别名称' },
  { value: 'description', label: '描述' }
]
</script>

<style scoped>
</style>
