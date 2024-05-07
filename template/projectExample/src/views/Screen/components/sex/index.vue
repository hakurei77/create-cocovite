<template>
  <div class="box1">
    <div class="top">
      <p class="title">男女比例</p>
      <p class="bg"></p>
    </div>
    <div class="sex">
      <div class="man">
        <img src="../../images//man.png" alt="" />
        <p>男士58%</p>
      </div>
      <div class="woman">
        <img src="../../images//woman.png" alt="" />
        <p>女士42%</p>
      </div>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
let charts = ref()

onMounted(() => {
  const mycharts = echarts.init(charts.value)
  mycharts.setOption({
    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, type: 'category' },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 20,
        z: '100',
        itemStyle: {
          borderRadius: 20,
        },
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        barGap: '-100%',
        itemStyle: {
          color: 'pink',
          borderRadius: 20,
        },
      },
    ],
    grid: {
      left: 100,
      top: 0,
      right: 100,
      bottom: 0,
    },
  })
})
</script>

<style scoped lang="scss">
.box1 {
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
    .right {
      float: right;
      margin-right: 20px;
      span {
        color: yellowgreen;
        font-size: 16px;
      }
    }
  }
  .sex {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    .man {
      box-sizing: border-box;
      padding-top: 30px;
      margin-top: 30px;
      width: 111px;
      height: 115px;

      background: url(../../images/man-bg.png) no-repeat;
      p {
        margin-top: 44px;
        text-align: left;
      }
    }
    .woman {
      width: 111px;
      height: 115px;
      margin-top: 30px;
      box-sizing: border-box;
      padding-top: 30px;
      background: url(../../images/woman-bg.png) no-repeat;
      p {
        margin-top: 44px;
        text-align: right;
      }
    }
  }

  .charts {
    margin-top: 20px;
    height: 100px;
  }
}
</style>
