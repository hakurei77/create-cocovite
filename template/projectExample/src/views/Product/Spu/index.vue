<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button
          v-has="`btn.Spu.add`"
          type="primary"
          size="default"
          icon="Plus"
          @click="addSPU"
          :disabled="!categoryStore.c3Id"
        >
          添加SPU
        </el-button>
        <el-table border style="margin: 10px 0" :data="records">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="100px"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                @click="addSku(row)"
                icon="Plus"
                title="添加SKU"
                v-has="`btn.Spu.addsku`"
              ></el-button>
              <el-button
                type="warning"
                size="small"
                @click="updateSPU(row)"
                icon="Edit"
                title="修改SPU"
                v-has="`btn.Spu.update`"
              ></el-button>
              <el-button
                v-has="`btn.Spu.skus`"
                type="info"
                size="small"
                @click="findSku(row)"
                icon="view"
                title="查看SKU列表"
              ></el-button>

              <el-popconfirm
                v-has="`btn.Spu.delete`"
                width="200px"
                :title="`你确定要删除${row.spuName}吗?`"
                @confirm="deleteSpu(row.id)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    icon="Delete"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="limit"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout=" prev, pager, next, jumper,->,total, sizes"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene" />
      <SkuForm v-show="scene == 2" @changeScene="changeScene" ref="sku" />
      <!-- 对话框：展示已有的sku列表数据 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu/index'
import type {
  HasSpuResponseData,
  Records,
  SpuData,
  SkuInfoData,
} from '@/api/product/spu/type'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import { ElMessage } from 'element-plus'

const categoryStore = useCategoryStore()

let scene = ref<number>(0)
let pageNo = ref<number>(1) //当前页码
let limit = ref<number>(3) //每一页展示多少条数据
let total = ref<number>(0) //存储已有品牌数据的总数
let records = ref<Records>([])
let spu = ref<any>()
let sku = ref<any>()
let skuArr = ref<any>([])
let show = ref<boolean>(false)
watch(
  () => categoryStore.c3Id,
  () => {
    if (categoryStore.c3Id) {
      getHasSpu()
    }
  },
)

const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  const res: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    limit.value,
    categoryStore.c3Id,
  )
  if (res.code == 200) {
    records.value = res.data.records
    total.value = res.data.total
  }
}

const changeSize = () => {
  getHasSpu()
}

const addSPU = () => {
  scene.value = 1
  spu.value.initAddSpu(categoryStore.c3Id)
}
const updateSPU = async (row: SpuData) => {
  scene.value = 1
  spu.value.initHasSpuData(row)
}
//子组件spuform点击取消变为场景0的自定义事件回调
const changeScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.params == 'update') {
    getHasSpu(pageNo.value)
  } else {
    getHasSpu()
  }
}
//添加sku按钮的回调
const addSku = (row: SpuData) => {
  //  console.log(row)
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
  scene.value = 2
}

const findSku = async (spu: SpuData) => {
  show.value = true
  const res: SkuInfoData = await reqSkuList(spu.id as number)
  if (res.code == 200) {
    skuArr.value = res.data
  }
  console.log(res)
}

const deleteSpu = async (spuId: number) => {
  const res = await reqRemoveSpu(spuId)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })

    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
//路由组件销毁前，清空仓库关于分类数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>
