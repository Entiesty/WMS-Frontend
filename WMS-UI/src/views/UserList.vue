<template>
  <el-card>
    <el-button type="primary" @click="addUser">新增</el-button>
    <el-table :data="records" border fit>
      <el-table-column prop="id" label="Id" align="center"/>
      <el-table-column prop="userName" label="UserName" align="center"/>
      <el-table-column prop="password" label="Password" align="center"/>
      <el-table-column prop="role" label="Role" align="center"/>
      <el-table-column prop="status" label="Status" align="center"/>
      <el-table-column prop="createdAt" label="CreatedAt" align="center"/>
      <el-table-column prop="updatedAt" label="UpdatedAt" align="center"/>
      <el-table-column label="Actions" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editUser(scope.row)">编辑</el-button>
          <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              :icon="InfoFilledIcon"
              icon-color="#626AEF"
              title="确定要删除该用户吗？"
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
      title="修改用户信息">
    <el-form :model="newUser" :rules="rules" ref="ruleFormRef" status-icon>
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
        <el-input v-model="newUser.userName" placeholder="请输入用户名"/>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
        <el-input v-model="newUser.password" placeholder="请输入用户密码"/>
      </el-form-item>
      <el-form-item label="角色" :label-width="formLabelWidth">
        <el-select v-model="newUser.role" placeholder="选择角色权限">
          <el-option label="超级管理员" value="super_admin"/>
          <el-option label="信息管理员" value="information_manager"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态" :label-width="formLabelWidth">
        <el-select v-model="newUser.status" placeholder="选择角色状态">
          <el-option label="启用" value="启用"/>
          <el-option label="禁用" value="禁用"/>
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
      title="修改用户信息">
    <el-form :model="user" :rules="rules" ref="ruleFormRef" status-icon>
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
        <el-input v-model="user.userName"/>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
        <el-input v-model="user.password"/>
      </el-form-item>
      <el-form-item label="角色" :label-width="formLabelWidth">
        <el-select v-model="user.role">
          <el-option label="超级管理员" value="super_admin"/>
          <el-option label="信息管理员" value="information_manager"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态" :label-width="formLabelWidth">
        <el-select v-model="user.status">
          <el-option label="启用" value="启用"/>
          <el-option label="禁用" value="禁用"/>
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
import {useUserList} from "@/hooks/user/useUserList.ts";
import {useUserEdit} from "@/hooks/user/useUserEdit.ts";
import {useUserFormValidation} from "@/hooks/user/useUserFormValidation.ts";
import {useUserDelete} from "@/hooks/user/useUserDelete.ts";
import {ref} from "vue";
import {useUserAdd} from "@/hooks/user/useUserAdd.ts";

// 使用用户列表相关逻辑
const {records, total, queryPageParam, fetchData, handleCurrentChange} = useUserList();

// 使用用户编辑相关逻辑
const {editDialogFormVisible, user, editUser, confirmUpdate, closeEditDialog} = useUserEdit();

// 使用用户表单验证逻辑
const {ruleFormRef, rules} = useUserFormValidation();

// 使用用户删除逻辑
const {confirmDelete} = useUserDelete(fetchData);

//使用用户样式
const {InfoFilledIcon, formLabelWidth} = useStyle();

const {addDialogFormVisible,
  newUser, addUser, confirmAddUser, closeAddDialog} = useUserAdd();

const validateBeforeSubmit = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if(editDialogFormVisible.value)
        await confirmUpdate();
      else{
        await confirmAddUser();
      }
      await fetchData();
    } else {
      console.log("Validation failed");
    }
  });
};
</script>

<style scoped>

</style>
