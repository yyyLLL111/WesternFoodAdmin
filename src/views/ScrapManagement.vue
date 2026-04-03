<template><div class="scrap-management"><div class="management-header"><div class="header-content"><h1 class="page-title">边角料管理</h1><p class="page-subtitle">管理您的中式面点边角料库存</p></div><div class="header-actions"><el-input
            v-model="searchQuery"
            placeholder="搜索边角料名称或类型"
            clearable
            class="search-input"
            prefix-icon="Search"
            size="large"
          ></el-input><el-button 
            type="primary" 
            @click="showDialog"
            class="add-button"
            size="large"
          ><el-icon class="icon"><Plus /></el-icon>添加边角料</el-button></div></div><el-card class="management-card"><el-table
          :data="filteredScraps"
          style="width: 100%"
          v-loading="loading"
          class="data-table"
          :header-cell-style="{ background: '#f8fafc', color: '#1e293b', fontWeight: '600' }"
        ><el-table-column prop="id" label="ID" width="120" align="center"></el-table-column><el-table-column prop="name" label="名称" min-width="180" show-overflow-tooltip></el-table-column><el-table-column prop="type" label="类型" width="120" align="center"><template #default="scope"><el-tag :type="getTypeTagType(scope.row.type)" size="small">{{ scope.row.type }}</el-tag></template></el-table-column><el-table-column label="数量" width="150" align="center"><template #default="scope"><div class="quantity-cell">{{ scope.row.quantity }}<span class="unit-text">{{ scope.row.unit }}</span></div></template></el-table-column><el-table-column prop="freshness" label="新鲜度" width="120" align="center"><template #default="scope"><el-tag :type="getFreshnessTagType(scope.row.freshness)" size="small">{{ scope.row.freshness }}</el-tag></template></el-table-column><el-table-column prop="createdAt" label="创建时间" align="center"><template #default="scope">{{ formatDate(scope.row.createdAt) }}</template></el-table-column><el-table-column label="操作" width="180" align="center"><template #default="scope"><div class="action-buttons"><el-button
                  type="primary"
                  size="small"
                  class="edit-button"
                  @click="editScrap(scope.row)"
                ><el-icon class="icon"><Edit /></el-icon>编辑</el-button><el-button
                  type="danger"
                  size="small"
                  class="delete-button"
                  @click="deleteScrap(scope.row.id)"
                ><el-icon class="icon"><Delete /></el-icon>删除</el-button></div></template></el-table-column></el-table><div class="pagination-container"><el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20, 50]"
            layout="total, sizes, prev, pager, next"
            :total="totalItems"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            class="custom-pagination"
          ></el-pagination></div></el-card><el-dialog
        v-model="dialogVisible"
        :title="isEdit ? '编辑边角料' : '添加边角料'"
        width="500px"
        class="custom-dialog"
        :close-on-click-modal="false"
      ><el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
          class="form-container"
        ><el-form-item label="名称" prop="name"><el-input 
              v-model="form.name" 
              placeholder="请输入边角料名称"
              size="large"
              class="form-input"
            ></el-input></el-form-item><el-form-item label="类型" prop="type"><el-select 
              v-model="form.type" 
              placeholder="请选择类型"
              size="large"
              class="form-select"
            ><el-option label="面制品" value="面制品"></el-option><el-option label="杂粮" value="杂粮"></el-option><el-option label="馅料" value="馅料"></el-option><el-option label="辅料" value="辅料"></el-option><el-option label="其他" value="其他"></el-option></el-select></el-form-item><el-form-item label="数量" prop="quantity"><el-input-number
              v-model="form.quantity"
              :min="1"
              :precision="0"
              style="width: 100%"
              size="large"
              class="form-input-number"
            ></el-input-number></el-form-item><el-form-item label="单位" prop="unit"><el-select 
              v-model="form.unit" 
              placeholder="请选择单位"
              size="large"
              class="form-select"
            ><el-option label="克" value="克"></el-option><el-option label="千克" value="千克"></el-option><el-option label="个" value="个"></el-option><el-option label="片" value="片"></el-option><el-option label="其他" value="其他"></el-option></el-select></el-form-item><el-form-item label="新鲜度" prop="freshness"><el-select 
              v-model="form.freshness" 
              placeholder="请选择新鲜度"
              size="large"
              class="form-select"
            ><el-option label="新鲜" value="新鲜"></el-option><el-option label="中等" value="中等"></el-option><el-option label="即将过期" value="即将过期"></el-option></el-select></el-form-item></el-form><template #footer><span class="dialog-footer"><el-button 
              @click="dialogVisible = false"
              class="cancel-button"
              size="large"
            >取消</el-button><el-button 
              type="primary" 
              @click="submitForm"
              class="submit-button"
              size="large"
            >确定</el-button></span></template></el-dialog></div></template><script setup>import { ref, computed, onMounted } from 'vue'
import { useScrapStore } from '../stores/scrapStore'
import { ElMessage } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

const scrapStore = useScrapStore()

const getTypeTagType = (type) => {
  const typeMap = {
    '面制品': 'primary',
    '杂粮': 'success',
    '馅料': 'warning',
    '辅料': 'info',
    '其他': 'info'
  }
  return typeMap[type] || 'info'
}

const getFreshnessTagType = (freshness) => {
  const freshnessMap = {
    '新鲜': 'success',
    '中等': 'warning',
    '即将过期': 'danger'
  }
  return freshnessMap[freshness] || 'info'
}
const loading = computed(() => scrapStore.loading)
const scraps = computed(() => scrapStore.scraps)

const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const form = ref({
  id: '',
  name: '',
  type: '',
  quantity: 1,
  unit: '克',
  freshness: '新鲜'
})

const rules = {
  name: [{ required: true, message: '请输入边角料名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  unit: [{ required: true, message: '请选择单位', trigger: 'change' }],
  freshness: [{ required: true, message: '请选择新鲜度', trigger: 'change' }]
}

const filteredScraps = computed(() => {
  let filtered = scraps.value
  if (searchQuery.value) {
    filtered = scraps.value.filter(scrap =>
      scrap.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      scrap.type.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filtered.slice(startIndex, endIndex)
})

const totalItems = computed(() => {
  if (searchQuery.value) {
    return scraps.value.filter(scrap =>
      scrap.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      scrap.type.toLowerCase().includes(searchQuery.value.toLowerCase())
    ).length
  }
  return scraps.value.length
})

const showDialog = () => {
  isEdit.value = false
  form.value = {
    id: '',
    name: '',
    type: '',
    quantity: 1,
    unit: '克',
    freshness: '新鲜'
  }
  dialogVisible.value = true
}

const editScrap = (scrap) => {
  isEdit.value = true
  form.value = { ...scrap }
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          await scrapStore.updateScrap(form.value.id, form.value)
          ElMessage.success('边角料更新成功')
        } else {
          await scrapStore.createScrap(form.value)
          ElMessage.success('边角料添加成功')
        }
        dialogVisible.value = false
      } catch (error) {
        ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
      }
    }
  })
}

const deleteScrap = async (id) => {
  try {
    await scrapStore.deleteScrap(id)
    ElMessage.success('边角料删除成功')
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

onMounted(() => {
  scrapStore.fetchScraps()
})</script><style scoped>.scrap-management {
  padding: 24px;
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  flex: 1;
}

.page-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}

.page-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-input {
  width: 320px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.add-button {
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.add-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.add-button:active:not(:disabled) {
  transform: translateY(0);
}

.icon {
  margin-right: 8px;
}

.management-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.data-table {
  border-radius: 8px;
  overflow: hidden;
}

.data-table :deep(.el-table__inner-wrapper) {
  border-radius: 8px;
}

.data-table :deep(.el-table__row) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.data-table :deep(.el-table__row:hover) {
  background: rgba(102, 126, 234, 0.05);
}

.quantity-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.unit-text {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.edit-button,
.delete-button {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.edit-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.delete-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding: 16px;
}

.custom-pagination :deep(.el-pagination__total) {
  color: #64748b;
  font-weight: 500;
}

.custom-pagination :deep(.el-pagination__sizes) {
  color: #64748b;
}

.custom-pagination :deep(.el-pagination__btn) {
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-pagination :deep(.el-pagination__btn:not(.is-disabled):hover) {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.custom-pagination :deep(.el-pagination__btn.is-active) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
}

.custom-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid #e2e8f0;
  padding: 24px 24px 16px;
}

.custom-dialog :deep(.el-dialog__title) {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.custom-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-input,
.form-select,
.form-input-number {
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-input:focus,
.form-select:focus,
.form-input-number:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 24px;
  border-top: 1px solid #e2e8f0;
}

.cancel-button,
.submit-button {
  height: 44px;
  border-radius: 12px;
  font-weight: 600;
  padding: 0 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.submit-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.cancel-button:hover:not(:disabled) {
  background: #f1f5f9;
}

@media (max-width: 768px) {
  .scrap-management {
    padding: 16px;
  }
  
  .management-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .search-input {
    width: 100%;
  }
  
  .page-title {
    font-size: 24px;
  }
}</style>