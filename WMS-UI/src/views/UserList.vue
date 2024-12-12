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
      <el-table-column label="Actions" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editUser(scope.row)">编辑</el-button>
          <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              :icon="InfoFilled"
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
      v-model="editDialogFormVisible"
      title="修改用户信息">
    <el-form :model="user" :rules="rules" ref="ruleFormRef" status-icon>
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
        <el-input v-model="user.userName" placeholder="请输入新的用户名"/>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
        <el-input v-model="user.password" placeholder="请输入新的用户密码"/>
      </el-form-item>
      <el-form-item label="角色" :label-width="formLabelWidth">
        <el-select v-model="user.role" placeholder="选择角色权限">
          <el-option label="超级管理员" value="super_admin"/>
          <el-option label="信息管理员" value="information_manager"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态" :label-width="formLabelWidth">
        <el-select v-model="user.status" placeholder="选择角色状态">
          <el-option label="启用" value="启用"/>
          <el-option label="禁用" value="禁用"/>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="closeEditDialog">取消</el-button>
      <el-button type="primary" @click="confirmUpdate">保存</el-button>
    </template>
  </el-dialog>


</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {deleteRequest, getRequest, postRequest, putRequest} from "@/services/api.ts";
import {InfoFilled} from "@element-plus/icons-vue";
import type {User} from '@/types/Data.ts'
import type {FormInstance, FormRules} from "element-plus";

const records = ref<User>();
const total = ref<number>(0);
let editDialogFormVisible = ref<boolean>(false);
const formLabelWidth = ref<string>('80px');

interface QueryPageParam {
  current: number;
  size: number;
}

const queryPageParam = reactive<QueryPageParam>({
  current: 1,
  size: 5,
});

const user = reactive<User>({
  createdAt: "", id: 0, password: "", role: "", status: "", updatedAt: "", userName: ""
})

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

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  userName: '',
  password: '',
});

const checkUserName = async (rule: any, value: string, callback: Function) => {
  if (!value) {
    return callback(new Error('用户名不能为空'));
  }
  try {
    const response = await getRequest('/user/' + value); // 确保请求完成
    console.log(response);
    if (!response.data) {
      callback(); // 如果用户已存在
    } else {
      callback(new Error('用户名已存在')); // 用户名可用
    }
  } catch (error: any) {
    if (error.response && error.response.status === 403) {
      console.error('403 Forbidden: 登录状态失效或权限不足');
    }
    callback(new Error('验证用户名时发生错误')); // 捕获其他错误
  }
};


const rules = reactive<FormRules<typeof ruleForm>>({
  userName: [
    {required: true, message: '用户名不能为空', trigger: 'blur'},
    {asyncValidator: checkUserName, trigger: 'blur'}
  ],
  password: [
    {required: true, message: '密码不能为空', trigger: 'blur' },
    {pattern: /^(?=.*\d).{8,}$/, message: '密码至少包含一个数字且至少八个字符', trigger: 'blur'}
  ]
});









onMounted(() => {
  fetchUsers();
})

const handleCurrentChange = (val: number) => {
  queryPageParam.current = val;
  fetchUsers();
}

function confirmDelete(id: number) {
  // 发起删除请求
  deleteRequest("/user/" + id)
      .then(() => {
        // 删除成功后刷新用户列表
        fetchUsers();
        // 你可以根据需要在此显示提示框或者其他信息
        console.log(`User with id ${id} deleted successfully.`);
      })
      .catch((error) => {
        // 错误处理
        console.error("Failed to delete user:", error);
      });
}

const confirmUpdate = () => {
  const payload = {
    id: user.id, // 使用 `user.id` 来确认当前用户
    userName: user.userName,
    password: user.password,
    role: user.role,
    status: user.status,
  };

  putRequest('/user', payload)
      .then(() => {
        fetchUsers();
        editDialogFormVisible.value = false;
        console.log('User updated successfully.');
      })
      .catch((error) => {
        console.log(payload);
        console.error('Failed to update user:', error);
      });
};



function closeEditDialog() {
  editDialogFormVisible.value = false;
}

function editUser(row: User) {
  Object.assign(user, row); // 将当前用户的数据赋值给 `user`，包括 `id` 等
  editDialogFormVisible.value = true; // 打开编辑对话框
}

</script>

<style scoped>

</style>
