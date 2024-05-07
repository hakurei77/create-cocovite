<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button
          v-has="`btn.Attr.add`"
          type="primary"
          size="default"
          @click="addAttr"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="200px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag
                style="margin: 6px"
                v-for="item in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                @click="updateAttr(row)"
                icon="Edit"
                v-has="`btn.Attr.update`"
              ></el-button>

              <el-popconfirm
                v-has="`btn.Attr.remove`"
                :title="`你确定要删除${row.attrName}属性吗?`"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请你输入属性的名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          :disabled="!attrParams.attrName"
          type="primary"
          size="default"
          icon="Plus"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button size="default" @click="cancel">取消</el-button>
        <el-table
          border
          style="margin: 10px 0"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            width="100px"
            type="index"
            align="center"
            label="序号"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input
                :ref="(vc:any)=>inputArr[$index]=vc"
                v-if="row.flag"
                v-model="row.valueName"
                placeholder="请你输入对应属性值"
                @blur="toLook(row, $index)"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import useCategoryStore from '@/store/modules/category'
import {
  reqAttr,
  reqAddOrUpdateAttr,
  reqDeleteAttr,
} from '@/api/product/attr/index'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'
const categoryStore = useCategoryStore()
let attrArr = ref<Attr[]>([])
//定义card组件内容切换变量
let scene = ref<number>(0)
//准备一个数组，将来存储对应的组件实例
let inputArr = ref<any>([])

//收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: '',
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3,
})
watch(
  () => categoryStore.c3Id,
  () => {
    //清空上一次查询的属性值
    attrArr.value = []
    if (categoryStore.c3Id) {
      getAttr()
    }
  },
)

//获取已有的属性和属性值的方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  const res: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (res.code == 200) {
    attrArr.value = res.data
  }
}

const addAttr = () => {
  scene.value = 1
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3,
  })
}

const updateAttr = (row: Attr) => {
  scene.value = 1
  // attrParams.attrName = row.attrName
  // attrParams.attrValueList = row.attrValueList
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

const cancel = () => {
  scene.value = 0
}

const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true,
  })
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

const save = async () => {
  const res = await reqAddOrUpdateAttr(attrParams)
  if (res.code == 200) {
    scene.value = 0
    ElMessage({
      message: attrParams.id ? '修改成功' : '添加成功',
      type: 'success',
    })

    getAttr()
  } else {
    ElMessage({
      message: attrParams.id ? '修改失败' : '添加失败',
      type: 'error',
    })
  }
}

const toLook = (row: AttrValue, $index: number) => {
  if (row.valueName.trim() == '') {
    //非法情况一
    attrParams.attrValueList.splice($index, 1)

    ElMessage({
      message: '属性值不能为空',
      type: 'error',
    })
    return
  }

  //非法情况二
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      //排除自己和自己判断
      return item.valueName === row.valueName
    }
  })

  if (repeat) {
    ElMessage({
      message: '属性值不能重复',
      type: 'error',
    })
    return
  }
  row.flag = false
}

const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

const deleteAttr = async (id: number) => {
  const res: any = await reqDeleteAttr(id)
  if (res.code == 200) {
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    getAttr()
  } else {
    ElMessage({
      message: '删除失败',
      type: 'error',
    })
  }
}

//路由组件销毁时，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>
