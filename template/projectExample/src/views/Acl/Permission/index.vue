<template>
  <el-table
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
    :data="permissionList"
  >
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="code" label="权限值" />
    <el-table-column prop="updateTime" label="修改时间" />
    <el-table-column label="操作">
      <template #="{ row, $index }">
        <el-button
          v-has="`btn.Permission.add`"
          type="primary"
          size="small"
          @click="addPermission(row)"
          :disabled="row.level == 4"
        >
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          v-has="`btn.Permission.update`"
          type="primary"
          size="small"
          @click="updatePermission(row)"
          :disabled="row.level == 1"
        >
          编辑
        </el-button>
        <el-popconfirm
          v-has="`btn.Permission.remove`"
          :title="`你确定要删除${row.name}吗`"
          @confirm="deleteMenu(row)"
        >
          <template #reference>
            <el-button type="primary" size="small" :disabled="row.level == 1">
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    v-model="dialogVisible"
    :title="perssionParams.id ? '编辑权限' : '新增权限'"
  >
    <el-form>
      <el-form-item label="名称">
        <el-input
          v-model="perssionParams.name"
          placeholder="请你输入权限名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限值">
        <el-input
          v-model="perssionParams.code"
          placeholder="请你输入权限值"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import {
  reqPermissionList,
  reqAddOrUpdatePermission,
  reqDeleteMenu,
} from '@/api/acl/menu'
import type {
  Permission,
  PermissionList,
  PermissionResponseData,
  menuParams,
} from '@/api/acl/menu/type'
let permissionList = ref<PermissionList>([])
let dialogVisible = ref<boolean>(false)
let perssionParams = reactive<menuParams>({
  name: '',
  code: '',
  level: 0,
  pid: 0,
})
const getHasPmsList = async () => {
  const res: PermissionResponseData = await reqPermissionList()
  if (res.code == 200) {
    permissionList.value = res.data
  }
}

onMounted(() => {
  getHasPmsList()
})

const addPermission = (row: Permission) => {
  dialogVisible.value = true
  Object.assign(perssionParams, {
    name: '',
    code: '',
    id: 0,
    level: row.level + 1,
    pid: row.id,
  })
}
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  Object.assign(perssionParams, row)
}

const confirm = async () => {
  const res = await reqAddOrUpdatePermission(perssionParams)

  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: perssionParams.id ? '编辑成功' : '添加成功',
    })
    dialogVisible.value = false
    getHasPmsList()
  } else {
    ElMessage({
      type: 'error',
      message: perssionParams.id ? '编辑失败' : '添加失败',
    })
  }
}

const deleteMenu = async (row: Permission) => {
  const res = await reqDeleteMenu(row.id as number)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasPmsList()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
</script>

<style scoped></style>
