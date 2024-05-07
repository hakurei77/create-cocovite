<template>
  <div class="tabbar">
    <!-- 顶部左侧静态 -->
    <div class="tabbaar_left"><Breadcrumb /></div>
    <div class="tabbaar_right"><Setting /></div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>

<script lang="ts">
export default {
  name: 'Tabbar',
}
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .tabbaar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .tabbaar_right {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
}
</style>
