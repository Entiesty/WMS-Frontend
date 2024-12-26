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
        <el-button type="primary" @click="addRoute" block>新增</el-button>
      </el-col>
    </el-row>
    <el-table :data="filteredRoutes" border fit>
      <el-table-column prop="id" label="Id" align="center"/>
      <el-table-column prop="name" label="Route Name" align="center"/>
      <el-table-column prop="path" label="Path" align="center"/>
      <el-table-column prop="parentName" label="Parent Name" align="center"/>
      <el-table-column prop="role" label="role" align="center"/>
      <el-table-column label="Actions" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editRoute(scope.row)">编辑</el-button>
          <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              title="确定要删除该路由吗？"
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

  <el-dialog
      v-model="addDialogFormVisible"
      title="新增路由信息">
    <el-form :model="newRoute" :rules="rules" ref="ruleFormRef" status-icon>
      <el-form-item label="路由名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="newRoute.name" placeholder="请输入路由名称"/>
      </el-form-item>

      <el-form-item label="父级路由" :label-width="formLabelWidth">
        <el-select v-model="newRoute.parentName" placeholder="请选择父级路由">
          <el-option
              v-for="item in routeList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="角色" :label-width="formLabelWidth" prop="role">
        <el-select v-model="newRoute.role" placeholder="请选择角色">
          <el-option label="super_admin" value="super_admin"/>
          <el-option label="information_manager" value="information_manager"/>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="closeAddDialog">取消</el-button>
      <el-button type="primary" @click="validateBeforeSubmit">确认</el-button>
    </template>
  </el-dialog>

  <el-dialog
      v-model="editDialogFormVisible"
      title="编辑路由信息">
    <el-form :model="route" :rules="rules" ref="ruleFormRef" status-icon>
      <el-form-item label="路由名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="route.name"/>
      </el-form-item>
      <el-form-item label="父级路由" :label-width="formLabelWidth" prop="parentName">
        <el-select v-model="route.parentName" placeholder="请选择父级路由">
          <el-option
              v-for="item in records"
              :key="item.id"
              :label="item.parentName"
              :value="item.parentName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="角色" :label-width="formLabelWidth" prop="role">
        <el-select v-model="route.role" placeholder="请选择角色">
          <el-option label="super_admin" value="super_admin"/>
          <el-option label="information_manager" value="information_manager"/>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="closeEditDialog">取消</el-button>
      <el-button type="primary" @click="validateBeforeSubmit">保存</el-button>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import {useStyle} from '@/hooks/system/useStyle.ts';
import {useRouteList} from "@/hooks/route/useRouteList";
import {useRouteEdit} from "@/hooks/route/useRouteEdit";
import {useRouteFormValidation} from "@/hooks/route/useRouteFormValidation";
import {useRouteDelete} from "@/hooks/route/useRouteDelete";
import {computed, onMounted, reactive, ref} from "vue";
import {useRouteAdd} from "@/hooks/route/useRouteAdd";
import {getRequest} from "@/services/api.ts";
import type {Route} from "@/types/Data.ts";

// 使用路由列表相关逻辑
const {records, total, queryPageParam, fetchData, handleCurrentChange} = useRouteList();

// 使用路由编辑相关逻辑
const {editDialogFormVisible, route, editRoute, confirmUpdate, closeEditDialog} = useRouteEdit();

// 使用路由表单验证逻辑
const {ruleFormRef, rules} = useRouteFormValidation();

// 使用路由删除逻辑
const {confirmDelete} = useRouteDelete(fetchData);

// 使用路由样式
const {formLabelWidth} = useStyle();

const {addDialogFormVisible, newRoute, addRoute, confirmAddRoute, closeAddDialog} = useRouteAdd();

const validateBeforeSubmit = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (editDialogFormVisible.value)
        await confirmUpdate();
      else {
        await confirmAddRoute();
      }
      await fetchData();
    } else {
      console.log("Validation failed");
    }
  });
};

const searchQuery = ref<string>('');
const selectColumn = ref<string>('name');
const filteredRoutes = computed(() => {
  if (!searchQuery.value) {
    return records.value;
  }
  if(selectColumn.value === 'name')
    return records.value.filter(route => {
      return route.name.toString().toLowerCase().includes(searchQuery.value.toLowerCase());
    });
  else if(selectColumn.value === 'path')
    return records.value.filter(route => {
      return route.path.toLowerCase().includes(searchQuery.value.toLowerCase());
    });
  else if(selectColumn.value === 'parentId')
    return records.value.filter(route => {
      return route.parentName.toString().toLowerCase().includes(searchQuery.value.toLowerCase());
    });
  else if (selectColumn.value === 'role')
    return records.value.filter(route => {
      return route.role.toString().toLowerCase().includes(searchQuery.value.toLowerCase());
    });
});

const options = [
  {
    value: 'name',
    label: '路由名称'
  },
  {
    value: 'path',
    label: '路由路径'
  },
  {
    value: 'parentName',
    label: '父级路由'
  },
  {
    value: 'role',
    label: '角色'
  }
]

let routeList = reactive<Route[]>([]);

onMounted(async () => {
  routeList = (await getRequest('/route')).data;
  console.log('routeList' ,routeList);
});

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
