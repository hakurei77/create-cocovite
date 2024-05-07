<template>
  <div class="box5">
    <div class="top">
      <p class="title">未来7天游客量趋势图</p>
      <p class="bg"></p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
let charts = ref<any>()
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    title: {
      text: '访问量',
      textStyle: {
        color: ' #fff',
        fontSize: '14px',
      },
    },
    xAxis: {
      type: 'category', //均匀分布
      boundaryGap: false, //两侧不留白
      splitLine: { show: false }, //不要分割线
      axisTick: { show: true }, //显示轴线刻度
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { show: true, lineStyle: { color: '#fff' } }, //显示轴线
    },
    yAxis: {
      splitLine: { show: false }, //不要分割线
      axisLine: { show: true, lineStyle: { color: '#fff' } }, //显示轴线
      axisTick: { show: true }, //显示轴线刻度
      nameTextStyle: { color: '#fff' },
    },
    grid: {
      left: 40,
      right: 10,
      top: 0,
      bottom: 20,
    },
    series: [
      {
        type: 'line',
        data: [120, 640, 66, 599, 321, 890, 500],
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'red', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'blue', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.box5 {
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 20px;
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
    height: calc(100% - 40px);
  }
}
</style>
