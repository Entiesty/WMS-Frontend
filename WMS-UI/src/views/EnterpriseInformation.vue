<template>
  <el-radio-group v-model="size">
    <el-radio value="large">Large</el-radio>
    <el-radio value="default">Default</el-radio>
    <el-radio value="small">Small</el-radio>
  </el-radio-group>

  <el-descriptions
      class="margin-top"
      title="Company Information (With border)"
      :column="3"
      :size="size"
      border
  >
    <template #extra>
      <el-button type="primary">Edit</el-button>
    </template>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <office-building />
          </el-icon>
          Company Name
        </div>
      </template>
      Tech Innovations Ltd.
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <location />
          </el-icon>
          Location
        </div>
      </template>
      Beijing, China
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <iphone />
          </el-icon>
          Contact Number
        </div>
      </template>
      010-12345678
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <tickets />
          </el-icon>
          Industry
        </div>
      </template>
      Information Technology
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <user />
          </el-icon>
          CEO
        </div>
      </template>
      John Doe
    </el-descriptions-item>
  </el-descriptions>

  <el-descriptions
      class="margin-top"
      title="Company Information (Without border)"
      :column="3"
      :size="size"
      :style="blockMargin"
  >
    <template #extra>
      <el-button type="primary">Edit</el-button>
    </template>
    <el-descriptions-item label="Company Name">Tech Innovations Ltd.</el-descriptions-item>
    <el-descriptions-item label="Location">Beijing, China</el-descriptions-item>
    <el-descriptions-item label="Contact Number">010-12345678</el-descriptions-item>
    <el-descriptions-item label="Industry">Information Technology</el-descriptions-item>
    <el-descriptions-item label="CEO">John Doe</el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Iphone,
  Location,
  OfficeBuilding,
  Tickets,
  User,
} from '@element-plus/icons-vue'
import type { ComponentSize } from 'element-plus'

const size = ref<ComponentSize>('default')  // 确保默认值是有效的

const iconStyle = computed(() => {
  const marginMap: { small: string; default: string; large: string } = {
    large: '8px',
    default: '6px',
    small: '4px',
  }

  // 使用类型保护，确保 size.value 是有效的
  const sizeValue = size.value || 'default'; // 如果 size.value 为空，则使用默认值 'default'

  return {
    marginRight: marginMap[sizeValue] || marginMap.default, // 默认值为 'default'
  }
})

const blockMargin = computed(() => {
  const marginMap: { small: string; default: string; large: string } = {
    large: '32px',
    default: '28px',
    small: '24px',
  }

  // 同样使用类型保护
  const sizeValue = size.value || 'default';

  return {
    marginTop: marginMap[sizeValue] || marginMap.default,
  }
})

</script>

<style scoped>
.el-descriptions {
  margin-top: 20px;
}
.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}
</style>
