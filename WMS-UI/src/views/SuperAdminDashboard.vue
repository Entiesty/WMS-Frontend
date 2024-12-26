<template>
  <div>
    <el-container>
      <el-aside width="250px" class="overflow-hidden h-screen shadow">
        <el-scrollbar class="h-full overflow-auto">
          <el-menu @select="handleMenuSelect">
            <div class="flex justify-center">
              <span>仓储管理系统</span>
            </div>

            <el-menu-item index="0">
              <template #title>
                <el-icon>
                  <House/>
                </el-icon>
                <span>首页</span>
              </template>
            </el-menu-item>

            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <User/>
                </el-icon>
                <span>用户管理</span>
              </template>
              <el-menu-item index="1-1">用户列表</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="2">
              <template #title>
                <el-icon>
                  <UserFilled/>
                </el-icon>
                <span>个人信息</span>
              </template>
              <el-menu-item index="2-1">更新个人信息</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="3">
              <template #title>
                <el-icon>
                  <OfficeBuilding/>
                </el-icon>
                <span>企业信息</span>
              </template>
              <el-menu-item index="3-1">查看企业信息</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="4">
              <template #title>
                <el-icon>
                  <Box/>
                </el-icon>
                <span>仓库管理</span>
              </template>
              <el-menu-item index="4-1">仓库列表</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="5">
              <template #title>
                <el-icon>
                  <Goods/>
                </el-icon>
                <span>货品管理</span>
              </template>
              <el-menu-item index="5-1">货品类别</el-menu-item>
              <el-menu-item index="5-2">货品信息</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="6">
              <template #title>
                <el-icon>
                  <Van/>
                </el-icon>
                <span>出入库管理</span>
              </template>
              <el-menu-item index="6-1">出入库记录</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="7">
              <template #title>
                <el-icon>
                  <Lock/>
                </el-icon>
                <span>权限管理</span>
              </template>
              <el-menu-item index="7-1">菜单权限</el-menu-item>
<!--              <el-menu-item index="7-2">仓库权限</el-menu-item>-->
            </el-sub-menu>

            <el-sub-menu index="8">
              <template #title>
                <el-icon>
                  <DataAnalysis/>
                </el-icon>
                <span>数据统计</span>
              </template>
              <el-menu-item index="8-1">货品进出统计</el-menu-item>
              <el-menu-item index="8-2">货品排名</el-menu-item>
            </el-sub-menu>

<!--            <el-sub-menu index="9">-->
<!--              <template #title>-->
<!--                <el-icon>-->
<!--                  <DataLine/>-->
<!--                </el-icon>-->
<!--                <span>仓库统计</span>-->
<!--              </template>-->
<!--              <el-menu-item index="9-1">仓库进出排名</el-menu-item>-->
<!--              <el-menu-item index="9-2">仓库排名</el-menu-item>-->
<!--            </el-sub-menu>-->
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <!-- Main Content -->
      <el-container>
        <!-- Header -->
        <el-header class="grid grid-cols-6 gap-4 content-end border-b shadow">
          <el-dropdown class="col-start-6 col-end-7">
            <div>
              <el-avatar class="mx-auto" :size="45" :src="`http://localhost:8080/uploads/avatar.jpg`"/>
              <span class="pl-5 text-base my-auto">{{ 'Welcome!' + authorizationStore.userName }}
              <el-icon><arrow-down/></el-icon></span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">登出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>

        <!-- Main Area -->
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowDown,
  Box,
  DataAnalysis,
  DataLine,
  Goods,
  House,
  Lock,
  OfficeBuilding,
  User,
  UserFilled,
  Van
} from '@element-plus/icons-vue'
import {useMenu} from "@/hooks/system/useMenu.ts";
import {useAuthorizationStore} from "@/stores/authorizationStore.ts";

const {handleMenuSelect, handleLogout} = useMenu();
const authorizationStore = useAuthorizationStore();




</script>

<style scoped>

</style>
