<template>
  <el-form label-width="100px" label-position="left">
    <el-form-item label="sku名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格（元）">
      <el-input
        placeholder="价格（元）"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量（克）">
      <el-input
        placeholder="重量（克）"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="sku描述">
      <el-input
        type="textarea"
        placeholder="sku描述"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              :value="`${item.id}:${option.id}`"
              :label="option.valueName"
              v-for="option in item.attrValueList"
              :key="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          :label="saleAttr.saleAttrName"
          v-for="saleAttr in saleArr"
          :key="saleAttr.id"
        >
          <el-select v-model="saleAttr.saleIdAndValueId">
            <el-option
              :value="`${saleAttr.id}:${value.id}`"
              :label="value.saleAttrValueName"
              v-for="value in saleAttr.spuSaleAttrValueList"
              :key="value.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column
          type="selection"
          align="center"
          width="200px"
        ></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img style="width: 100px; height: 100px" :src="row.imgUrl" alt="" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="warning" size="default" @click="handler(row)">
              设置为默认图
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { SkuData } from '@/api/product/spu/type'
import { reqAttr } from '@/api/product/attr/index'
import {
  reqSpuImageList,
  reqSpuSaleAttr,
  reqAddSku,
} from '@/api/product/spu/index'
import { ElMessage } from 'element-plus'
const $emit = defineEmits(['changeScene'])

let attrArr = ref<any>([])
let saleArr = ref<any>([])
let imgArr = ref<any>([])
let skuParams = reactive<SkuData>({
  //父组件传递过来的数据进行收集
  category3Id: '',
  spuId: '',
  tmId: '',
  //v-model收集
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  //其他办法收集
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '',
})

let table = ref<any>()

const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}

const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
) => {
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  const res = await reqAttr(c1Id, c2Id, spu.category3Id) //获取平台属性
  const res1 = await reqSpuImageList(spu.id) //获取照片墙数据
  const res2 = await reqSpuSaleAttr(spu.id) //获取销售属性
  attrArr.value = res.data
  imgArr.value = res1.data
  saleArr.value = res2.data
}

const handler = (row: any) => {
  imgArr.value.forEach((item: any) =>
    table.value.toggleRowSelection(item, false),
  )
  table.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl
}

const save = async () => {
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      const [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({ attrId, valueId })
    }
    return prev
  }, [])
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        const [saleAttrId, saleAttrvalueId] = next.saleIdAndValueId.split(':')
        prev.push({ saleAttrId, saleAttrvalueId })
      }
      return prev
    },
    [],
  )
  const res = await reqAddSku(skuParams)
  console.log(res)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '新增sku成功',
    })

    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '新增sku失败',
    })
  }
}
defineExpose({ initSkuData })
</script>

<style scoped></style>
