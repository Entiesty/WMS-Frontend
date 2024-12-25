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
        <el-button type="primary" @click="addItem" block>新增</el-button>
      </el-col>
    </el-row>
    <el-table :data="filteredItems" border fit>
      <el-table-column prop="id" label="Id" align="center"/>
      <el-table-column prop="itemName" label="Item Name" align="center"/>
      <el-table-column prop="price" label="Price" align="center"/>
      <el-table-column prop="stock" label="Stock" align="center"/>
      <el-table-column prop="itemCategoryName" label="ItemCategoryName" align="center"/>
      <el-table-column prop="warehouseName" label="WarehouseName" align="center"/>
      <el-table-column label="Image" align="center">
        <template #default="scope">
          <el-image
              style="width: 100px; height: 100px"
              :src="`http://localhost:8080${scope.row.imageUrl}`"
              fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editItem(scope.row)">编辑</el-button>
          <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              :icon="InfoFilledIcon"
              icon-color="#626AEF"
              title="确定要删除该商品吗？"
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
      title="新增商品信息">
    <el-form :model="newItem" :rules="rules" ref="ruleFormRef" status-icon>
      <el-form-item label="商品名称" :label-width="formLabelWidth" prop="itemName">
        <el-input v-model="newItem.itemName" placeholder="请输入商品名称"/>
      </el-form-item>
      <el-form-item label="价格" :label-width="formLabelWidth" prop="price">
        <el-input v-model="newItem.price" placeholder="请输入商品价格"/>
      </el-form-item>
      <el-form-item label="库存" :label-width="formLabelWidth" prop="stock">
        <el-input v-model="newItem.stock" placeholder="请输入商品库存"/>
      </el-form-item>
      <el-form-item label="类别" :label-width="formLabelWidth">
        <el-select v-model="newItem.itemCategoryName" placeholder="选择商品类别">
          <el-option
              v-for="itemCategory in itemCategories"
              :key="itemCategory.id"
              :label="itemCategory.itemCategoryName"
              :value="itemCategory.itemCategoryName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库" :label-width="formLabelWidth">
        <el-select v-model="newItem.warehouseName" placeholder="选择仓库">
          <el-option
              v-for="warehouse in warehouses"
              :key="warehouse.id"
              :label="warehouse.warehouseName"
              :value="warehouse.warehouseName">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 图片上传 -->
      <el-form-item label="商品图片" :label-width="formLabelWidth">
        <el-upload
            action="http://localhost:8080/api/upload"
            :headers="{
    'authorization': 'Bearer ' + token}"
            :on-success="handleImageSuccess"
            :on-remove="handleRemove"
            :file-list="imageList"
            accept="image/*"
            list-type="picture-card"
            :limit="1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="closeAddDialog">取消</el-button>
      <el-button type="primary" @click="validateBeforeSubmit">确认</el-button>
    </template>
  </el-dialog>

  <el-dialog
      v-model="editDialogFormVisible"
      title="编辑商品信息">
    <el-form :model="item" :rules="rules" ref="ruleFormRef" status-icon>
      <el-form-item label="商品名称" :label-width="formLabelWidth" prop="itemName">
        <el-input v-model="item.itemName"/>
      </el-form-item>
      <el-form-item label="价格" :label-width="formLabelWidth" prop="price">
        <el-input v-model="item.price"/>
      </el-form-item>
      <el-form-item label="库存" :label-width="formLabelWidth" prop="stock">
        <el-input v-model="item.stock"/>
      </el-form-item>
      <el-form-item label="类别" :label-width="formLabelWidth">
        <el-select v-model="item.itemCategoryName">
          <el-option
              v-for="itemCategory in itemCategories"
              :key="itemCategory.id"
              :label="itemCategory.itemCategoryName"
              :value="itemCategory.itemCategoryName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库" :label-width="formLabelWidth">
        <el-select v-model="item.warehouseName">
          <el-option
              v-for="warehouse in warehouses"
              :key="warehouse.id"
              :label="warehouse.warehouseName"
              :value="warehouse.warehouseName">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 图片上传 -->
    <el-form-item label="商品图片" :label-width="formLabelWidth">
      <el-upload
          action="http://localhost:8080/api/upload"
          :headers="{
    'authorization': 'Bearer ' + token}"
          :on-success="handleImageSuccess"
          :on-remove="handleRemove"
          :file-list="imageList"
          accept="image/*"
          list-type="picture-card"
          :limit="1"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>

    <template #footer>
      <el-button @click="closeEditDialog">取消</el-button>
      <el-button type="primary" @click="validateBeforeSubmit">保存</el-button>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import {useStyle} from '@/hooks/system/useStyle.ts';
import {useItemList} from "@/hooks/item/useItemList";
import {useItemEdit} from "@/hooks/item/useItemEdit";
import {useItemFormValidation} from "@/hooks/item/useItemFormValidation";
import {useItemDelete} from "@/hooks/item/useItemDelete";
import {computed, onMounted, ref, watch} from "vue";
import {useItemAdd} from "@/hooks/item/useItemAdd";
import type {ItemCategory, Warehouse} from "@/types/Data.ts";
import {getRequest} from "@/services/api.ts";
import {useAuthorizationStore} from "@/stores/authorizationStore.ts";
import {useWarehouseName} from "@/stores/warehouseName.ts";
import {useAddOrEdit} from "@/stores/addOrEdit.ts";

// 使用商品列表相关逻辑
const {records, total, queryPageParam, fetchData, handleCurrentChange} = useItemList();

// 使用商品编辑相关逻辑
const {editDialogFormVisible, item, editItem, confirmUpdate, closeEditDialog} = useItemEdit();

// 使用商品表单验证逻辑
const {ruleFormRef, rules} = useItemFormValidation();

// 使用商品删除逻辑
const {confirmDelete} = useItemDelete(fetchData);

// 使用商品样式
const {InfoFilledIcon, formLabelWidth} = useStyle();

const {addDialogFormVisible, newItem, addItem, confirmAddItem, closeAddDialog} = useItemAdd();

const itemCategories = ref<ItemCategory[]>();
const warehouses = ref<Warehouse[]>();
let imageList = ref<any[]>([]);
const authorizationStore = useAuthorizationStore();
const token = authorizationStore.token;
const warehouseName = useWarehouseName();
watch(newItem, (newValue) => {
  if (newItem.warehouseName) {
    warehouseName.setCurrentWarehouseName(newValue.warehouseName)
    console.log('newValue', newValue.warehouseName);
    console.log(warehouseName.currentWarehouseName);
  }
})

const addOrEdit = useAddOrEdit().addOrEdit;


// 处理上传成功后的回调
const handleImageSuccess = (response: any, file: any, fileList: any) => {
  console.log('response', response);
  // 假设返回的图片路径是 response.url
  if(addOrEdit === 'add'){
    newItem.imageUrl = response.imageUrl;
  } else {
    item.imageUrl = response.imageUrl;
  }
};

// 删除图片时清空图片 URL
const handleRemove = (file: any, fileList: any) => {
  imageList.value = fileList;
  if (fileList.length === 0) {
    newItem.imageUrl = ""; // 清空商品的图片 URL
  }
};

// 初始化商品类别
const fetchItemCategories = async () => {
  try {
    const response = await getRequest('/item-category');
    itemCategories.value = await response.data;
  } catch (error) {
    console.error('Error fetching item categories:', error);
  }
};

const fetchWarehouses = async () => {
  try {
    const response = await getRequest('/warehouse');
    warehouses.value = await response.data;
    console.log('warehouses', warehouses.value);
  } catch (error) {
    console.error('Error fetching warehouses:', error);
  }
}

onMounted(() => {
  fetchItemCategories();
  fetchWarehouses();
})


const validateBeforeSubmit = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (editDialogFormVisible.value)
        await confirmUpdate();
      else {
        await confirmAddItem();
      }
      imageList.value = [];
      await fetchData();
    } else {
      console.log("Validation failed");
    }
  });
};

const searchQuery = ref<string>('');
const selectColumn = ref<string>('itemName')
const filteredItems = computed(() => {
  if (!searchQuery.value) {
    return records.value;
  }
  if (selectColumn.value === 'itemName')
    return records.value.filter(record => {
      return record.itemName.toString().toLowerCase().includes(searchQuery.value.toLowerCase());
    });
  else if (selectColumn.value === 'price')
    return records.value.filter(record => {
      return record.price.toString().toLowerCase().includes(searchQuery.value.toLowerCase());
    });
  else if (selectColumn.value === 'stock')
    return records.value.filter(record => {
      return record.stock.toString().toLowerCase().includes(searchQuery.value.toLowerCase());
    });
});

const options = [
  {value: 'itemName', label: '商品名称'},
  {value: 'price', label: '价格'},
  {value: 'stock', label: '库存'}
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
