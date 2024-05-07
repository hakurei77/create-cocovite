<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          :disabled="scene == 1"
          v-model="categoryStore.c1Id"
          @change="handler"
        >
          <el-option
            :label="c1.name"
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene == 1"
          v-model="categoryStore.c2Id"
          @change="handler1"
        >
          <el-option
            :label="c2.name"
            v-for="c2 in categoryStore.c2Arr"
            :key="c2.id"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="scene == 1" v-model="categoryStore.c3Id">
          <el-option
            :label="c3.name"
            v-for="c3 in categoryStore.c3Arr"
            :key="c3.id"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useCategoryStore from '@/store/modules/category'
const categoryStore = useCategoryStore()
onMounted(() => {
  getC1()
})

//通知仓库获取一级分类的方法
const getC1 = () => {
  categoryStore.getC1()
}
//此方法即为一级分类下拉菜单的change事件会触发（保证一级分类ID有了）
const handler = () => {
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  categoryStore.getC2()
}
const handler1 = () => {
  categoryStore.c3Id = ''
  categoryStore.getC3()
}

defineProps(['scene'])
</script>

<style scoped></style>
