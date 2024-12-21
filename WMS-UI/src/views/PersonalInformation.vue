<template>
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

    <el-button @click="closeEditDialog">取消</el-button>
    <el-button type="primary" @click="validateBeforeSubmit">保存</el-button>
</template>

<script setup lang="ts">
import {useAuthorizationStore} from "@/stores/authorizationStore.ts";
import {getRequest} from "@/services/api.ts";
import {onMounted} from "vue";
import {useStyle} from '@/hooks/system/useStyle.ts'
import {useUserFormValidation} from "@/hooks/user/useUserFormValidation.ts";
import {useUserEdit} from "@/hooks/user/useUserEdit.ts";
import {useAddOrEdit} from "@/stores/addOrEdit.ts";
import {useUserStore} from "@/stores/userStore.ts";

// 获取 authorizationStore 中的用户名
const authorizationStore = useAuthorizationStore();
const userName = authorizationStore.userName;
const {InfoFilledIcon, formLabelWidth} = useStyle()
// 使用用户表单验证逻辑
const {ruleFormRef, rules} = useUserFormValidation();
// 使用用户编辑相关逻辑
const {editDialogFormVisible, user, editUser, confirmUpdate, closeEditDialog} = useUserEdit();
const userStore = useUserStore();

// 获取用户数据
const fetchUserData = async () => {
  try {
    const response = await getRequest(`/user/${userName}`);
    console.log(response);
    if (response && response.data) {
      Object.assign(user, response.data);
      userStore.setCurrentUser(response.data);
    } else {
      console.error("用户数据格式不正确");
    }
  } catch (error) {
    console.error("获取用户数据失败", error);
    // 处理错误（例如，弹出错误提示）
  }
};

const validateBeforeSubmit = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      await confirmUpdate();
      await fetchUserData();
    } else {
      console.log("Validation failed");
    }
  });
};

// 在组件挂载时获取用户数据
onMounted(() => {
  const editOrAdd = useAddOrEdit();
  editOrAdd.setAddOrEdit('edit')
  fetchUserData();
});
</script>

<style scoped>
</style>
