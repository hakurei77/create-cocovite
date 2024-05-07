<template>
  <el-card>
    <el-table border :data="skuList" style="margin: 10px 0">
      <el-table-column
        label="序号"
        type="index"
        width="100px"
        align="center"
      ></el-table-column>
      <el-table-column
        label="名称"
        show-overflow-tooltip
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="默认图片">
        <template #="{ row, $index }">
          <img style="width: 100px; height: 100px" :src="row.skuDefaultImg" />
        </template>
      </el-table-column>
      <el-table-column label="重量(g)" prop="weight"></el-table-column>
      <el-table-column label="价格(元)" prop="price"></el-table-column>
      <el-table-column label="操作">
        <template #="{ row }">
          <el-button
            v-has="`btn.Sku.updown`"
            :type="row.isSale == 0 ? 'success' : 'info'"
            size="small"
            @click="updateSale(row)"
            :icon="row.isSale == 0 ? 'Top' : 'Bottom'"
            :title="row.isSale == 0 ? '商品上架' : '商品下架'"
          ></el-button>
          <el-button
            v-has="`btn.Sku.update`"
            type="warning"
            size="small"
            @click="updateSku()"
            icon="Edit"
            title="修改SPU"
          ></el-button>
          <el-button
            v-has="`btn.Sku.detail`"
            type="info"
            size="small"
            @click="findSku(row)"
            icon="InfoFilled"
            title="查看SKU列表"
          ></el-button>
          <el-popconfirm
            v-has="`btn.Sku.remove`"
            width="300px"
            :title="`你确定要删除 ${row.skuName}吗?`"
            @confirm="removeSku(row)"
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
  </el-card>
  <el-pagination
    v-model:current-page="pageNo"
    v-model:page-size="limit"
    :page-sizes="[10, 20, 30, 40]"
    :background="true"
    layout=" prev, pager, next, jumper,->,total, sizes"
    :total="total"
    @current-change="getHasSku"
    @size-change="handler"
  />
  <!-- 抽屉组件 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>查看商品详情</h4>
    </template>
    <template #default>
      <el-row style="margin: 20px 0">
        <el-col :span="6">名称</el-col>
        <el-col :span="18">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row style="margin: 20px 0">
        <el-col :span="6">描述</el-col>
        <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row style="margin: 20px 0">
        <el-col :span="6">价格</el-col>
        <el-col :span="18">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row style="margin: 20px 0">
        <el-col :span="6">平台属性</el-col>
        <el-col :span="18">
          <el-tag
            style="margin: 0 10px 10px 0"
            v-for="(item, index) in skuInfo.skuAttrValueList"
            :key="item.id"
          >
            {{ item.valueName }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0">
        <el-col :span="6">销售属性</el-col>
        <el-col :span="18">
          <el-tag
            style="margin: 0 10px"
            v-for="(item, index) in skuInfo.skuSaleAttrValueList"
            :key="index"
          >
            {{ item.saleAttrValueName }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0">
        <el-col :span="6">商品图片</el-col>
        <el-col :span="18">
          <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img
                :src="item.imgUrl"
                alt=""
                style="width: 100%; height: 100%"
              />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  reqSkuList,
  reqSaleSku,
  reqCancelSaleSku,
  reqSkuInfo,
  reqRemoveSku,
} from '@/api/product/sku/index'
import type {
  SkuResponseData,
  SkuData,
  SkuInfoData,
} from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
let pageNo = ref<number>(1) //当前页码
let limit = ref<number>(10) //每一页展示多少条数据
let total = ref<number>(0) //存储已有品牌数据的总数
let skuList = ref<SkuData[]>([])
let drawer = ref<boolean>(false)
let skuInfo = ref<any>({})
const getHasSku = async (pager = 1) => {
  pageNo.value = pager
  const res: SkuResponseData = await reqSkuList(pageNo.value, limit.value)
  console.log(res)

  if (res.code == 200) {
    skuList.value = res.data.records
    total.value = res.data.total
  }
}
onMounted(() => {
  getHasSku()
})

const handler = () => {
  getHasSku()
}

const updateSale = async (sku: SkuData) => {
  if (sku.isSale == 0) {
    const res = await reqSaleSku(sku.id as number)
    if (res.code == 200) {
      ElMessage({
        type: 'success',
        message: '商品上架成功',
      })
      getHasSku(pageNo.value)
    } else {
      ElMessage({
        type: 'error',
        message: '商品上架失败',
      })
    }
  } else {
    const res1 = await reqCancelSaleSku(sku.id as number)
    if (res1.code == 200) {
      ElMessage({
        type: 'success',
        message: '商品下架成功',
      })
      getHasSku(pageNo.value)
    } else {
      ElMessage({
        type: 'error',
        message: '商品下架失败',
      })
    }
  }
}

const updateSku = () => {
  ElMessage({
    type: 'success',
    message: '此功能程序员开发中……',
  })
}

const findSku = async (sku: SkuData) => {
  drawer.value = true
  const res: SkuInfoData = await reqSkuInfo(sku.id as number)
  if (res.code == 200) {
    skuInfo.value = res.data
  }
}

const removeSku = async (sku: SkuData) => {
  const res: any = await reqRemoveSku(sku.id as number)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })

    getHasSku(skuList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败(系统数据不能删除)',
    })
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
