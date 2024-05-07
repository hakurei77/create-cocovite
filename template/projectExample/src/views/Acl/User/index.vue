<template>
  <el-card style="height: 80px; margin-bottom: 20px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
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
      @click="addUser"
      v-has="`btn.User.add`"
    >
      添加
    </el-button>
    <el-button
      :disabled="!selectIdArr.length"
      size="default"
      type="danger"
      @click="deleteSelectUser"
      v-has="`btn.all`"
    >
      批量删除
    </el-button>
    <el-table
      @selection-change="selectionChange"
      :data="userList"
      border
      style="margin: 10px 0"
    >
      <el-table-column
        type="selection"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        type="index"
        label="#"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="用户名字" prop="username"></el-table-column>
      <el-table-column label="用户名称" prop="name"></el-table-column>
      <el-table-column
        label="用户角色"
        width="300px"
        prop="roleName"
      ></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            icon="User"
            size="small"
            @click="setRole(row)"
            v-has="`btn.User.assgin`"
          >
            分配角色
          </el-button>
          <el-button
            size="small"
            type="warning"
            icon="Edit"
            @click="editUser(row)"
            v-has="`btn.User.update`"
          >
            编辑
          </el-button>
          <el-popconfirm
            v-has="`btn.User.remove`"
            width="300px"
            @confirm="removeUser(row)"
            :title="`你确定要删除${row.username}吗?`"
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
      @size-change="changePageNo"
      @current-change="getHasUser"
    />
  </el-card>
  <!-- 抽屉：完成添加用户和修改用户 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '修改用户' : '新增用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="form">
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input type="password" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 抽屉：对某个账号进行角色分配 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配用户角色</h4>
    </template>
    <template #default>
      <el-form label-width="80px">
        <el-form-item label="用户姓名">
          <el-input :disabled="true" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="userRole"
            @change="handleCheckedRolesChange"
          >
            <el-checkbox v-for="role in allRole" :key="role.id" :label="role">
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  reqAllUser,
  reqAddOrUpdateUser,
  reqRemoveUser,
  reqAllRole,
  reqSetRole,
  reqRemoveSelectUser,
} from '@/api/acl/user'
import type {
  UserResponseData,
  Records,
  UserData,
  AllRollResponseData,
  AllRole,
  setRoleParamsData,
} from '@/api/acl/user/type'

import useLayoutSettingStore from '@/store/modules/setting'
let pageNo = ref<number>(1)
let limit = ref<number>(5)
let total = ref<number>(0)
let userList = ref<Records>([])
let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)
let userParams = ref<UserData>({
  username: '',
  password: '',
  name: '',
})
let form = ref<any>()
let checkAll = ref<boolean>(false)
const isIndeterminate = ref<boolean>(true)
let allRole = ref<AllRole>([])
let userRole = ref<AllRole>([])
let selectIdArr = ref<number[]>([])
let keyword = ref<string>('')
let settingStore = useLayoutSettingStore()
const validateUsername = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户名需大于等于5位'))
  }
}
const validateName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户昵称需大于等于5位'))
  }
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 6) {
    callback()
  } else {
    callback(new Error('密码需大于等于6位'))
  }
}
const rules = {
  username: [
    {
      required: true,
      trigger: 'blur',
      validator: validateUsername,
    },
  ],
  name: [
    {
      required: true,
      trigger: 'blur',
      validator: validateName,
    },
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: validatePassword,
    },
  ],
}
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  const res: UserResponseData = await reqAllUser(
    pageNo.value,
    limit.value,
    keyword.value,
  )
  if (res.code == 200) {
    userList.value = res.data.records
    total.value = res.data.total
  }
}
onMounted(() => {
  getHasUser()
})
const changePageNo = () => {
  getHasUser()
}
const addUser = () => {
  drawer.value = true
  Object.assign(userParams.value, {
    username: '',
    password: '',
    name: '',
    id: '',
  })
  //清除上一次错误的提示信息
  nextTick(() => {
    form.value.clearValidate('username')
    form.value.clearValidate('name')
    form.value.clearValidate('password')
  })
}
const cancelClick = () => {
  drawer.value = false
}
const confirmClick = async () => {
  await form.value.validate()
  const res: any = await reqAddOrUpdateUser(userParams.value)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: userParams.value.id ? '更新用户成功' : '新增用户成功',
    })
    drawer.value = false
    //因为下行代码强制刷新只会留在第一个，所以一下代码不执行（两行代码只能选其一，不能共存）
    //getHasUser(userParams.value.id ? pageNo.value : 1)
    //因为修改了用户名，原账号不存在了，所以需要刷新一下页面获取新账号信息
    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: userParams.value.id ? '更新用户失败' : '新增用户失败',
    })
  }
}
const removeUser = async (row: UserData) => {
  const res = await reqRemoveUser(row.id as number)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除用户成功',
    })
    getHasUser(userList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除用户失败',
    })
  }
}

const editUser = (row: UserData) => {
  drawer.value = true
  Object.assign(userParams.value, row)
  //清除上一次错误的提示信息
  nextTick(() => {
    form.value.clearValidate('username')
    form.value.clearValidate('name')
  })
}
const setRole = async (row: UserData) => {
  drawer1.value = true
  Object.assign(userParams.value, row)
  const res: AllRollResponseData = await reqAllRole(row.id as number)
  if (res.code == 200) {
    allRole.value = res.data.allRolesList
    userRole.value = res.data.assignRoles
  }
}

const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}

const handleCheckedRolesChange = (value: string[]) => {
  checkAll.value = value.length == allRole.value.length
  isIndeterminate.value =
    value.length > 0 && value.length < allRole.value.length
}

const confirmRole = async () => {
  let setRoleParams: setRoleParamsData = {
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
    userId: userParams.value.id as number,
  }

  const res: any = await reqSetRole(setRoleParams)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配角色成功',
    })
    drawer1.value = false
    getHasUser(pageNo.value)
  } else {
    ElMessage({
      type: 'error',
      message: '分配角色失败',
    })
  }
}

const selectionChange = (value: any) => {
  selectIdArr.value = value.map((item: any) => item.id)
}
const deleteSelectUser = async () => {
  const res = await reqRemoveSelectUser(selectIdArr.value)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除用户成功',
    })
    getHasUser(userList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除用户失败',
    })
  }
}

const search = () => {
  getHasUser()
  keyword.value = ''
}

const reset = () => {
  settingStore.refresh = !settingStore.refresh
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
