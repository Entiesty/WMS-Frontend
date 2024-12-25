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
        <el-button type="primary" @click="addStockTransaction" block>新增</el-button>
      </el-col>
    </el-row>
    <el-table :data="filteredStockTransactions" border fit>
      <el-table-column prop="id" label="Id" align="center"/>
      <el-table-column prop="itemName" label="物品名称" align="center"/>
      <el-table-column prop="quantity" label="数量" align="center"/>
      <el-table-column prop="transactionType" label="交易类型" align="center"/>
      <el-table-column prop="sourceWarehouseName" label="源仓库" align="center"/>
      <el-table-column prop="targetWarehouseName" label="目标仓库" align="center"/>
      <el-table-column prop="operatorName" label="操作员" align="center"/>
      <el-table-column prop="transactionTime" label="交易时间" align="center"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editStockTransaction(scope.row)">编辑</el-button>
          <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              :icon="InfoFilledIcon"
              icon-color="#626AEF"
              title="确定要删除该交易吗？"
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

  <!-- 新增库存交易对话框 -->
  <el-dialog v-model="addDialogFormVisible" title="新增交易">
    <el-form :model="newStockTransaction" :rules="rules" ref="ruleFormRef" status-icon>
      <el-form-item label="货品名称" :label-width="formLabelWidth" prop="itemName">
        <el-select v-model="newStockTransaction.itemName" placeholder="请选择物品名称">
          <el-option
              v-for="item in items"
              :key="item.id"
              :label="item.itemName"
              :value="item.itemName">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="数量" :label-width="formLabelWidth" prop="quantity">
        <el-input v-model="newStockTransaction.quantity" placeholder="请输入交易数量"/>
      </el-form-item>
      <el-form-item label="交易类型" :label-width="formLabelWidth">
        <el-select v-model="newStockTransaction.transactionType" placeholder="选择交易类型">
          <el-option label="入库" value="in"/>
          <el-option label="出库" value="out"/>
          <el-option label="调拨" value="transfer"/>
        </el-select>
      </el-form-item>

      <el-form-item v-if="newStockTransaction.transactionType === 'in'" label="目标仓库" :label-width="formLabelWidth">
        <el-select v-model="newStockTransaction.targetWarehouseName" placeholder="请选择目标仓库">
          <el-option
              v-for="warehouse in availableWarehouses"
              :key="warehouse"
              :label="warehouse"
              :value="warehouse"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="newStockTransaction.transactionType === 'out'" label="源仓库" :label-width="formLabelWidth">
        <el-select v-model="newStockTransaction.sourceWarehouseName" placeholder="请选择源仓库">
          <el-option
              v-for="warehouse in availableWarehouses"
              :key="warehouse"
              :label="warehouse"
              :value="warehouse"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="newStockTransaction.transactionType === 'transfer'" label="源仓库"
                    :label-width="formLabelWidth">
        <el-select v-model="newStockTransaction.sourceWarehouseName" placeholder="请选择源仓库">
          <el-option
              v-for="warehouse in availableWarehouses"
              :key="warehouse"
              :label="warehouse"
              :value="warehouse"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="newStockTransaction.transactionType === 'transfer'" label="目标仓库"
                    :label-width="formLabelWidth">
        <el-select v-model="newStockTransaction.targetWarehouseName" placeholder="请选择目标仓库">
          <el-option
              v-for="warehouse in targetWarehouses"
              :key="warehouse"
              :label="warehouse"
              :value="warehouse"
          ></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="操作员" :label-width="formLabelWidth" prop="operatorName">
        <el-select v-model="newStockTransaction.operatorName" placeholder="请选择操作员">
          <el-option
              v-for="operator in operators"
              :key="operator.id"
              :label="operator.userName"
              :value="operator.userName">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="closeAddDialog">取消</el-button>
      <el-button type="primary" @click="validateBeforeSubmit">确认</el-button>
    </template>
  </el-dialog>

  <!-- 编辑库存交易对话框 -->
  <el-dialog v-model="editDialogFormVisible" title="编辑交易">
    <el-form :model="stockTransaction" :rules="rules" ref="ruleFormRef" status-icon>
      <el-form-item label="物品名称" :label-width="formLabelWidth" prop="itemName">
        <el-input v-model="stockTransaction.itemName" placeholder="请输入物品名称"/>
      </el-form-item>
      <el-form-item label="数量" :label-width="formLabelWidth" prop="quantity">
        <el-input v-model="stockTransaction.quantity" placeholder="请输入交易数量"/>
      </el-form-item>
      <el-form-item label="交易类型" :label-width="formLabelWidth">
        <el-select v-model="stockTransaction.transactionType" placeholder="选择交易类型">
          <el-option label="入库" value="in"/>
          <el-option label="出库" value="out"/>
        </el-select>
      </el-form-item>
      <el-form-item label="目标仓库" :label-width="formLabelWidth">
        <el-input v-model="stockTransaction.targetWarehouseName" placeholder="请输入目标仓库"/>
      </el-form-item>
      <el-form-item label="操作员" :label-width="formLabelWidth" prop="operatorName">
        <el-input v-model="stockTransaction.operatorName" placeholder="请输入操作员姓名"/>
      </el-form-item>
      <el-form-item label="交易时间" :label-width="formLabelWidth" prop="transactionTime">
        <el-input v-model="stockTransaction.transactionTime" placeholder="请输入交易时间"/>
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
import {useStockTransactionList} from "@/hooks/stockTransaction/useStockTransactionList";
import {useStockTransactionEdit} from "@/hooks/stockTransaction/useStockTransactionEdit";
import {useStockTransactionFormValidation} from "@/hooks/stockTransaction/useStockTransactionFormValidation";
import {useStockTransactionDelete} from "@/hooks/stockTransaction/useStockTransactionDelete";
import {computed, onMounted, ref, watch} from "vue";
import {useStockTransactionAdd} from "@/hooks/stockTransaction/useStockTransactionAdd";
import {getRequest} from "@/services/api.ts";
import type {Item, ItemCategory, User, Warehouse} from "@/types/Data.ts";

const itemCategories = ref<ItemCategory[]>();
const warehouses = ref<Warehouse[]>();
const operators = ref<User[]>();
const items = ref<Item[]>();
const fetchItemCategories = async () => {
  try {
    const response = await getRequest('/item-category');
    itemCategories.value = await response.data;
    console.log('itemCategories', itemCategories);
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

const fetchOperators = async () => {
  try {
    const response = await getRequest('/user');
    operators.value = await response.data;
    console.log('operators', operators.value);
  } catch (error) {
    console.error('Error fetching operators:', error);
  }
}

const fetchItems = async () => {
  try {
    const response = await getRequest('/item');
    items.value = await response.data;
    console.log('items', items.value);
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

onMounted(() => {
  fetchItemCategories();
  fetchWarehouses();
  fetchOperators();
  fetchItems();
})


// 使用库存交易列表相关逻辑
const {records, total, queryPageParam, fetchData, handleCurrentChange} = useStockTransactionList();

// 使用库存交易编辑相关逻辑
const {
  editDialogFormVisible,
  stockTransaction,
  editStockTransaction,
  confirmUpdate,
  closeEditDialog
} = useStockTransactionEdit();

// 使用库存交易表单验证逻辑
const {ruleFormRef, rules} = useStockTransactionFormValidation();

// 使用库存交易删除逻辑
const {confirmDelete} = useStockTransactionDelete(fetchData);

// 使用库存交易新增逻辑
const {
  addDialogFormVisible,
  newStockTransaction,
  addStockTransaction,
  confirmAddStockTransaction,
  closeAddDialog
} = useStockTransactionAdd();

// 使用用户样式
const {InfoFilledIcon, formLabelWidth} = useStyle();

const validateBeforeSubmit = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (editDialogFormVisible.value)
        await confirmUpdate();
      else {
        await confirmAddStockTransaction();
      }
      await fetchData();
    } else {
      console.log("Validation failed");
    }
  });
};

const searchQuery = ref<string>('');
const selectColumn = ref<string>('itemName')
const filteredStockTransactions = computed(() => {
  if (!searchQuery.value) {
    return records.value;
  }
  if (selectColumn.value === 'itemName')
    return records.value.filter(record => {
      return record.itemName.toString().toLowerCase().includes(searchQuery.value.toLowerCase());
    });
  else if (selectColumn.value === 'transactionType')
    return records.value.filter(record => {
      return record.transactionType.toLowerCase().includes(searchQuery.value.toLowerCase());
    });
  else if (selectColumn.value === 'warehouseName')
    return records.value.filter(record => {
      return record.sourceWarehouseName!.toLowerCase().includes(searchQuery.value.toLowerCase());
    });
});

const options = [
  {value: 'itemName', label: '物品名称'},
  {value: 'transactionType', label: '交易类型'},
  {value: 'warehouseName', label: '仓库名称'}
];

const availableWarehouses = ref<string[]>([]);  // 'in' 和 'out' 类型下的可用仓库
const targetWarehouses = ref<string[]>([]);  // 'transfer' 类型下的目标仓库

// 提取 itemName 中括号内的仓库名
const extractWarehouseFromItemName = (itemName: string): string => {
  const match = itemName.match(/\(([^)]+)\)$/);
  return match ? match[1] : '';
};

// 更新可用仓库列表（'in' 和 'out'）
const updateAvailableWarehouses = () => {
  const warehouse = extractWarehouseFromItemName(newStockTransaction.itemName);
  availableWarehouses.value = [warehouse];  // 'in' 或 'out' 只允许选择一个仓库
};

function removeParentheses(input: string) {
  return input.replace(/\s?\([^)]+\)$/, '');
}

// 获取目标仓库列表（'transfer' 类型）
const fetchTargetWarehouses = async () => {
  if (!newStockTransaction.itemName) return;

  const warehouse = extractWarehouseFromItemName(newStockTransaction.itemName);
  const cleanedItemName = removeParentheses(newStockTransaction.itemName);  // 清理 itemName 中的括号内容

  try {
    const response = await getRequest(`/item/for-warehouse/${cleanedItemName}`);
    const available = response.data;

    // 排除与源仓库相同的目标仓库
    targetWarehouses.value = available.filter((w: string) => w !== warehouse);
  } catch (error) {
    console.error("获取目标仓库列表失败:", error);
  }
};

// 监听 transactionType 和 itemName 的变化
watch(() => newStockTransaction.transactionType, (newValue) => {
  if (newValue === 'in' || newValue === 'out') {
    updateAvailableWarehouses();  // 只需要更新可用仓库
  } else if (newValue === 'transfer') {
    fetchTargetWarehouses();  // 获取目标仓库
  }
});

watch(() => newStockTransaction.itemName, (newValue) => {
  if (newStockTransaction.transactionType === 'in' || newStockTransaction.transactionType === 'out') {
    updateAvailableWarehouses();  // 只需要更新可用仓库
  } else if (newStockTransaction.transactionType === 'transfer') {
    fetchTargetWarehouses();  // 获取目标仓库
  }
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
