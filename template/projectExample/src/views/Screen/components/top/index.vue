<template>
  <div class="top">
    <div class="left"><span @click="goHome" class="lbtn">首页</span></div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据展示平台</div>
    </div>
    <div class="right">
      <span class="rbtn">统计报告</span>
      <span class="time">当前时间：{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
const $router = useRouter()
let time = ref(moment().format('YYYY-MM-DD HH:mm:ss'))
let timer = ref<any>(0)
const goHome = () => {
  $router.push('/')
}

onMounted(() => {
  timer.value = setInterval(() => {
    time.value = moment().format('YYYY-MM-DD hh:mm:ss')
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>

<style scoped lang="scss">
.top {
  width: 100%;
  height: 40px;
  display: flex;
  .left {
    flex: 1;
    background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;
    .lbtn {
      float: right;
      width: 150px;
      height: 40px;
      line-height: 40px;
      color: #29fcff;
      background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      font-size: 18px;
    }
  }
  .center {
    flex: 2;
    text-align: center;
    color: #29fcff;
    font-size: 30px;
    line-height: 74px;
    .title {
      width: 100%;
      height: 74px;
      background: url(../../images/dataScreen-header-center-bg.png) no-repeat;
      background-size: 100% 100%;
    }
  }
  .right {
    flex: 1;
    background: url(../../images/dataScreen-header-right-bg.png) no-repeat;
    background-size: 100% 100%;
    color: #29fcff;
    .rbtn {
      float: left;
      width: 150px;
      height: 40px;
      line-height: 40px;

      background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;

      font-size: 18px;
    }
    .time {
      float: right;
      height: 40px;
      line-height: 40px;
      margin-right: 20px;
      font-size: 14px;
    }
  }
}
</style>
