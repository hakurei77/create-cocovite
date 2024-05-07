<template>
  <el-button
    size="small"
    icon="Refresh"
    :circle="true"
    @click="updateRefresh"
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    :circle="true"
    @click="fullScreen"
  ></el-button>

  <el-popover
    placement="top-start"
    title="主题设置"
    :width="300"
    trigger="hover"
  >
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          @change="changeColor"
          v-model="color"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          @change="changeDark"
          v-model="dark"
          size="large"
          active-icon="Moon"
          inactive-icon="Sunny"
          inline-prompt
          style="--el-switch-on-color: black; --el-switch-off-color: #ff8c00"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" icon="Setting" :circle="true"></el-button>
    </template>
  </el-popover>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useLayoutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'

const layoutSettingStore = useLayoutSettingStore()
const userStore = useUserStore()

const $router = useRouter()
const $route = useRoute()
let dark = ref<boolean>(false)
//刷新按钮点击回调
const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}

//全屏按钮点击的回调
const fullScreen = () => {
  //DOM对象的一个属性：可以用来判断当前是不是全屏，返回布尔值
  let full = document.fullscreenElement
  //切换为全屏
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
//退出登录的回调
const logout = async () => {
  //第一件事：向服务发请求（退出登录接口）
  //第二件事：仓库中相关的数据清空（token)
  //第三件事：跳转到登录页
  await userStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

const changeDark = () => {
  let html = document.documentElement
  html.className = dark.value ? 'dark' : ''
}

const changeColor = () => {
  let html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>
<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style scoped></style>
