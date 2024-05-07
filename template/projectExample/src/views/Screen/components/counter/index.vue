<template>
  <div class="box8">
    <div class="top">
      <p class="title">预约渠道数据统计</p>
      <p class="bg"></p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

let charts = ref()

onMounted(() => {
  //获取echarts类的实例
  let mycharts = echarts.init(charts.value)

  let option = {
    radar: {
      // shape: 'circle',
      indicator: [
        { name: '购物', max: 6500 },
        { name: '出行', max: 16000 },
        { name: '餐饮', max: 30000 },
        { name: '旅游', max: 38000 },
        { name: '服饰', max: 52000 },
        { name: '学习', max: 25000 },
      ],
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: '购物',
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: '餐饮',
          },
        ],
      },
    ],
  }
  mycharts.setOption(option)
})
</script>

<style scoped lang="scss">
.box8 {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;
  .top {
    margin-left: 20px;
    color: #fff;
    .title {
      font-size: 20px;
    }
    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png);
      background-size: 100% 100%;
      margin-top: 10px;
    }
  }

  .charts {
    width: 100%;
    height: 230px;
  }
}
</style>
