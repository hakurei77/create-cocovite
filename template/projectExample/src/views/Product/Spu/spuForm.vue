<template>
  <el-form label-width="150px">
    <el-form-item label="SPU名称">
      <el-input
        v-model="spuParams.spuName"
        placeholder="请你输入SPU名称"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select placeholder="请你选择品牌" v-model="spuParams.tmId">
        <el-option
          v-for="item in allTrademark"
          :label="item.tmName"
          :key="item.id"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        v-model="spuParams.description"
        type="textarea"
        placeholder="请你输入SPU描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        v-model:file-list="imgList"
        action="/api//admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img
          style="width: 100%; height: 100%"
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select
        v-model="saleAttrIdAndValueName"
        :placeholder="`还有${unSelectedSaleAttr.length}个可选择`"
      >
        <el-option
          v-for="item in unSelectedSaleAttr"
          :label="item.name"
          :key="item.id"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        :disabled="!saleAttrIdAndValueName"
        type="primary"
        size="default"
        icon="Plus"
        @click="addSaleAttr"
        style="margin-left: 10px"
      >
        添加销售属性
      </el-button>
      <el-table style="margin: 10px 0" border :data="saleAttr">
        <el-table-column
          label="序号"
          align="center"
          type="index"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="属性名"
          width="200px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="属性值">
          <template #="{ row, $index }">
            <el-tag
              v-for="tag in row.spuSaleAttrValueList"
              :key="tag.id"
              class="mx-1"
              closable
              style="margin: 0 6px"
              @close="row.spuSaleAttrValueList.splice($index, 1)"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <el-input
              v-model="row.saleAttrValue"
              size="small"
              placeholder="请输入属性值"
              style="width: 100px"
              v-if="row.flag"
              @blur="toLook(row)"
              ref="input"
            ></el-input>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="Plus"
              @click="toEdit(row)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template #="{ row, $index }">
            <el-button
              type="danger"
              icon="Delete"
              size="small"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        :disabled="saleAttr.length > 0 ? false : true"
        type="primary"
        size="default"
        @click="save"
      >
        保存
      </el-button>
      <el-button size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type {
  SpuData,
  AllTrademark,
  SaleAttrResponseData,
  SpuHasImg,
  HasSaleAttrResponseData,
  Trademark,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
} from '@/api/product/spu/type'
import {
  reqAllTrademark,
  reqSpuImageList,
  reqSpuSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu/index'
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene'])
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}

let allTrademark = ref<Trademark[]>([])
let imgList = ref<SpuImg[]>([])
let saleAttr = ref<SaleAttr[]>([])
let allSaleAttr = ref<HasSaleAttr[]>([])

let spuParams = ref<SpuData>({
  category3Id: '',
  description: '',
  spuName: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: [],
})

//将来收集还未选择的销售属性的ID和属性值名字
let saleAttrIdAndValueName = ref<string>('')
let dialogVisible = ref<boolean>(false)
let dialogImageUrl = ref<string>('')
let unSelectedSaleAttr = computed(() => {
  let unSelectArr = allSaleAttr.value.filter((item) =>
    saleAttr.value.every((item2) => item.name != item2.saleAttrName),
  )
  return unSelectArr
})

const input = ref()
const initHasSpuData = async (spu: SpuData) => {
  spuParams.value = spu
  //spu即为父组件传递过来的已有的spu对象，但不完整
  const res: AllTrademark = await reqAllTrademark() //获取全部品牌数据
  const res1: SpuHasImg = await reqSpuImageList(spu.id as number) //获取某一个品牌旗下全部售卖商品的图片
  const res2: SaleAttrResponseData = await reqSpuSaleAttr(spu.id as number) //获取已有的spu销售属性
  const res3: HasSaleAttrResponseData = await reqAllSaleAttr() //获取全部销售属性
  allTrademark.value = res.data
  imgList.value = res1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  saleAttr.value = res2.data
  allSaleAttr.value = res3.data
}

const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')

  let newSaleAttr: any = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }

  saleAttr.value.push(newSaleAttr)

  saleAttrIdAndValueName.value = ''
}

const handlePictureCardPreview = (file: any) => {
  dialogVisible.value = true
  dialogImageUrl.value = file.url
}
//照片墙删除文件时的钩子
const handleRemove = () => {}
//上传成功之前的钩子：约束文件的大小和类型
const handlerUpload = (file: any) => {
  if (
    file.type == 'image/png' ||
    file.type == 'image/jpg' ||
    file.type == 'image/jpeg' ||
    file.type == 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true
    }
    ElMessage({
      type: 'error',
      message: '上传的图片大小不能大于3M',
    })
    return false
  } else {
    ElMessage({
      type: 'error',
      message: '只能上传图片文件',
    })
    return false
  }
}

const toEdit = (row: SaleAttr) => {
  row.flag = true
  row.saleAttrValue = ''
  nextTick(() => {
    input.value.focus()
  })
}

const toLook = (row: SaleAttr) => {
  //console.log(row)
  const { baseSaleAttrId, saleAttrValue } = row

  if (saleAttrValue?.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  if (
    row.spuSaleAttrValueList.find(
      (item) => item.saleAttrValueName == saleAttrValue,
    )
  ) {
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }

  row.spuSaleAttrValueList.push({
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  })
  row.flag = false
}

const save = async () => {
  //整理参数
  spuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })

  spuParams.value.spuSaleAttrList = saleAttr.value
  //发请求：添加SPU或更新SPU
  const res = await reqAddOrUpdateSpu(spuParams.value)
  console.log(res)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: spuParams.value.id ? '更新成功' : '添加成功',
    })
    $emit('changeScene', {
      flag: 0,
      params: spuParams.value.id ? 'update' : 'add',
    })
  } else {
    ElMessage({
      type: 'error',
      message: spuParams.value.id ? '更新失败' : '添加失败',
    })
  }
}

//添加一个新的SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  Object.assign(spuParams.value, {
    category3Id: '',
    description: '',
    spuName: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: [],
  })

  //清空照片
  imgList.value = []
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''
  const res: AllTrademark = await reqAllTrademark() //获取全部品牌数据
  const res1: HasSaleAttrResponseData = await reqAllSaleAttr() //获取全部销售属性数据
  allTrademark.value = res.data
  allSaleAttr.value = res1.data
  spuParams.value.category3Id = c3Id
}

//对外暴露方法
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped></style>
