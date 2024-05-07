<template>
  <el-card>
    <div class="box">
      <img
        style="border-radius: 50%; width: 100px; height: 100px; display: block"
        :src="userStore.avatar"
        alt=""
      />
      <div class="zu">
        <h1 class="title">{{ getTime() }} 好{{ userStore.username }}</h1>
        <h4 class="subtitle">硅谷甄选运营平台</h4>
      </div>
    </div>
  </el-card>
  <div class="bottom"><SvgIcon name="welcome" width="500" height="500" /></div>
</template>

<script setup lang="ts">
import { getTime } from '@/utils/time'
import useUserStore from '@/store/modules/user'

import SvgIcon from '@/components/SvgIcon/index.vue'
const userStore = useUserStore()
</script>

<style scoped lang="scss">
.box {
  display: flex;
  .zu {
    margin-left: 20px;
    .title {
      font-size: 40px;
      margin-bottom: 20px;
      font-weight: 900;
    }
    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}

.bottom {
  display: flex;
  justify-content: center;
}
</style>
