<template>
  <div class="box2">
    <div class="top">
      <p class="title">年龄比例</p>
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
  let option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '70px',
      right: '60px',
      orient: 'vertical',
      textStyle: {
        color: ' #fff',
        fontSize: '14px',
      },
      formatter: function (name: any) {
        let data = option.series[0].data
        let total = 0
        let tarValue: any
        for (let i = 0; i < data.length; i++) {
          total += data[i].value
          if (data[i].name == name) {
            tarValue = data[i].value
          }
        }
        let p = Math.round((tarValue / total) * 100) + '%'
        return `${name}   ${p}`
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        left: '-40%',
        top: '20px',
        radius: ['40%', '80%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          color: '#fff',
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: '军事' },
          { value: 735, name: '新闻' },
          { value: 580, name: '直播' },
          { value: 484, name: '娱乐' },
          { value: 300, name: '财经' },
        ],
      },
    ],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  }
  mycharts.setOption(option)
})
</script>

<style scoped lang="scss">
.box2 {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;
  color: #fff;
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
    height: 260px;
  }
}
</style>
