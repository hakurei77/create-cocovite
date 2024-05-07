<template>
  <el-pagination
    v-model:current-page="pageNo"
    v-model:page-size="limit"
    :page-sizes="[3, 5, 7, 9]"
    :background="true"
    layout=" prev, pager, next, jumper,->,total, sizes"
    :total="total"
    @current-change=""
    @size-change=""
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
let pageNo = ref<number>(1) //当前页码
let limit = ref<number>(3) //每一页展示多少条数据
let total = ref<number>(30) //存储已有品牌数据的总数
</script>

<style scoped></style>
