<template>
  <el-card style="height: 80px; margin-bottom: 20px">
    <el-form :inline="true" class="form">
      <el-form-item label="角色名称:">
        <el-input placeholder="请输入角色名称" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="default"
          @click="search"
          :disabled="!keyword"
        >
          搜索
        </el-button>
        <el-button size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card>
    <el-button
      type="primary"
      size="default"
      @click="addRole"
      v-has="`btn.Role.add`"
    >
      添加角色
    </el-button>
    <el-table border style="margin: 10px 0" :data="roleList">
      <el-table-column
        type="index"
        label="#"
        align="center"
        width="80px"
        prop="id"
      ></el-table-column>
      <el-table-column align="center" label="id" prop="id"></el-table-column>
      <el-table-column
        align="center"
        label="角色名称"
        prop="roleName"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            icon="User"
            size="small"
            @click="setPermission(row)"
            v-has="`btn.Role.assgin`"
          >
            分配权限
          </el-button>
          <el-button
            size="small"
            type="warning"
            icon="Edit"
            @click="updateRole(row)"
            v-has="`btn.Role.update`"
          >
            编辑
          </el-button>
          <el-popconfirm
            v-has="`btn.Role.remove`"
            width="300px"
            @confirm="removeRole(row)"
            :title="`你确定要删除${row.roleName}吗?`"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[5, 7, 9, 12]"
      :background="true"
      layout=" prev, pager, next, jumper,->,sizes, total"
      :total="total"
      @size-change="sizeChange"
      @current-change="getHasRoles"
    />
  </el-card>
  <el-dialog v-model="visible" :title="roleParams.id ? '修改角色' : '添加角色'">
    <el-form :model="roleParams" :rules="rules" ref="form">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          placeholder="请填写角色名称"
          v-model="roleParams.roleName"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handlerConfirm()">确定</el-button>
    </template>
  </el-dialog>
  <!-- 抽屉：分配权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedKeys"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  reqRoles,
  reqAddOrUpdateRole,
  reqDeleteRole,
  reqAllMenuList,
  reqSetPermission,
} from '@/api/acl/role'
import type {
  Records,
  RolesResponseData,
  RoleData,
  PermissionResponseData,
  MenuList,
} from '@/api/acl/role/type'
import useLayoutSettingStore from '@/store/modules/setting'
let pageNo = ref<number>(1)
let limit = ref<number>(5)
let total = ref<number>(0)
let roleList = ref<Records>([])
let keyword = ref<string>('')
let visible = ref<boolean>(false)
let drawer = ref<boolean>(false)
const tree = ref()
const form = ref<any>()
const settingStore = useLayoutSettingStore()
let roleParams = reactive<any>({
  roleName: '',
})

const defaultProps = {
  children: 'children',
  label: 'name',
}

let menuArr = ref<MenuList>([])
//存储勾选的节点的ID（四级的）
let checkedKeys = ref<number[]>([])
const getHasRoles = async (pager = 1) => {
  pageNo.value = pager
  const res: RolesResponseData = await reqRoles(
    pageNo.value,
    limit.value,
    keyword.value,
  )
  if (res.code == 200) {
    roleList.value = res.data.records
    total.value = res.data.total
  }
}
onMounted(() => {
  getHasRoles()
})
const sizeChange = () => {
  getHasRoles()
}
const search = () => {
  getHasRoles()
  keyword.value = ''
}

const reset = () => {
  settingStore.refresh = !settingStore.refresh
}

const addRole = async () => {
  visible.value = true
  roleParams.roleName = ''
  roleParams.id = ''
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

const updateRole = (row: RoleData) => {
  visible.value = true
  Object.assign(roleParams, row)
}

const validateRoleName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('角色名称至少2位'))
  }
}

const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validateRoleName }],
}

const handlerConfirm = async () => {
  await form.value.validate()
  const res = await reqAddOrUpdateRole(roleParams)

  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: roleParams.id ? '修改成功' : '添加成功',
    })
    visible.value = false
    getHasRoles(roleParams.id ? pageNo.value : 1)
  }
}

const removeRole = async (row: any) => {
  const res: any = await reqDeleteRole(row.id)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除角色成功',
    })
    getHasRoles(roleList.value.length > 1 ? pageNo.value : (pageNo.value = 1))
  } else {
    ElMessage({
      type: 'success',
      message: '删除角色失败',
    })
  }
}

const setPermission = async (row: RoleData) => {
  drawer.value = true
  Object.assign(roleParams, row)
  const res: PermissionResponseData = await reqAllMenuList(row.id as number)
  if (res.code == 200) {
    menuArr.value = res.data
    checkedKeys.value = filterSelectArr(menuArr.value, [])
  }
}

const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    } else {
      if (item.select && item.level == 4) {
        initArr.push(item.id)
      }
    }
  })
  return initArr
}

const confirm = async () => {
  let arr = tree.value.getCheckedKeys()
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = [...arr, ...arr1]
  console.log(arr, arr1, permissionId)

  const res: any = await reqSetPermission(roleParams.id as number, permissionId)
  if (res.code == 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: '分配权限成功',
    })

    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: '分配权限失败',
    })
  }
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
