<template>
  <div>
    <el-container style="height: 100vh">
      <el-aside>
        <el-scrollbar>
          <el-menu @select="handleMenuSelect">
            <span>仓储管理系统</span>
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <User/>
                </el-icon>
                <span>用户管理</span>
              </template>
              <el-menu-item index="1-1">用户列表</el-menu-item>
              <el-menu-item index="1-2">重置密码</el-menu-item>
              <el-menu-item index="1-3">修改密码</el-menu-item>
              <el-menu-item index="1-4">启用/禁用</el-menu-item>
              <el-menu-item index="1-5">角色设置</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="2">
              <template #title>
                <el-icon>
                  <UserFilled/>
                </el-icon>
                <span>个人信息</span>
              </template>
              <el-menu-item index="2-1">更新个人信息</el-menu-item>
              <el-menu-item index="2-2">修改密码</el-menu-item>
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
              <el-menu-item index="4-2">仓库权限</el-menu-item>
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
              <el-menu-item index="5-3">库存管理</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="6">
              <template #title>
                <el-icon>
                  <Van/>
                </el-icon>
                <span>出入库管理</span>
              </template>
              <el-menu-item index="6-1">出入库记录</el-menu-item>
              <el-menu-item index="6-2">调货记录</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="7">
              <template #title>
                <el-icon>
                  <Lock/>
                </el-icon>
                <span>权限管理</span>
              </template>
              <el-menu-item index="7-1">菜单权限</el-menu-item>
              <el-menu-item index="7-2">仓库权限</el-menu-item>
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

            <el-sub-menu index="9">
              <template #title>
                <el-icon>
                  <DataLine/>
                </el-icon>
                <span>仓库统计</span>
              </template>
              <el-menu-item index="9-1">仓库进出排名</el-menu-item>
              <el-menu-item index="9-2">仓库排名</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-container>
        <el-header>
          <el-dropdown>
            <span>Boogiepop</span>
            <el-icon><Avatar/></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">登出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>

        <el-main>
          <el-scrollbar>
            <router-view></router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import {Box, DataAnalysis, DataLine, Goods, Lock, OfficeBuilding,
  User, UserFilled, Van, Avatar} from '@element-plus/icons-vue'
import {useMenuAndLogout} from "@/hooks/useMenuAndLogout.ts";

const { handleMenuSelect, handleLogout } = useMenuAndLogout();
</script>

<style scoped>

</style>
