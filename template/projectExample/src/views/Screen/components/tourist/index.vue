<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>9999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import 'echarts-liquidfill'
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

let people = ref('216908人')
let charts = ref()
onMounted(() => {
  //获取echarts类的实例
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    title: {
      text: '水球图',
      textStyle: {
        color: '#fff',
      },
    },
    xAxis: {},
    yAxis: {},
    series: {
      type: 'liquidFill',
      data: [0.6, 0.4, 0.2],
      radius: '90%',
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })
})
</script>

<style scoped lang="scss">
.box {
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
    .right {
      float: right;
      margin-right: 20px;
      span {
        color: yellowgreen;
        font-size: 16px;
      }
    }
  }
  .number {
    display: flex;
    margin-top: 20px;
    text-align: center;
    box-sizing: border-box;
    padding: 40px 0 10px 0;
    span {
      flex: 1;
      width: 40px;
      height: 40px;
      line-height: 40px;
      background: url(../../images/total.png) no-repeat;

      background-size: 100% 100%;

      color: #29fcff;
    }
  }
  .charts {
    width: 100%;
    height: 230px;
  }
}
</style>
