<template>
  <el-card class="box-card">
    <!-- 添加品牌按钮 -->
    <el-button
      type="primary"
      icon="Plus"
      size="default"
      @click="addTradeMark"
      v-has="`btn.Trademark.add`"
    >
      添加品牌
    </el-button>
    <!-- 表格组件：用于展示已有的平台数据 -->
    <el-table style="margin: 10px 0" border :data="trademarkArr">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template #="{ row, $index }">
          <img style="width: 100px; height: 100px" :src="row.logoUrl" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{ row, $index }">
          <el-button
            v-has="`btn.Trademark.update`"
            type="primary"
            size="small"
            icon="edit"
            @click="updateTrademark(row)"
          ></el-button>
          <el-popconfirm
            v-has="`btn.Trademark.remove`"
            :title="`你确定要删除${row.tmName}吗?`"
            width="250px"
            icon="Delete"
            @confirm="removeTradeMark(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total"
      @current-change="getHasTrademark"
      @size-change="sizeChange"
    />
  </el-card>
  <!-- 对话框组件：在添加品牌与修改已有品牌的业务时使用的结构 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
  >
    <el-form
      style="width: 80%"
      :model="trademarkParams"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="品牌名称" label-width="120px" prop="tmName">
        <el-input
          placeholder="请您输入品牌名称"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="120px" prop="logoUrl">
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 具名插槽：footer -->
    <template #footer>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
      <el-button type="success" size="default" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, type UploadProps } from 'element-plus'
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import type {
  Records,
  TrademarkResData,
  Trademark,
} from '@/api/product/trademark/type'

let pageNo = ref<number>(1) //当前页码
let limit = ref<number>(3) //每一页展示多少条数据
let total = ref<number>(0) //存储已有品牌数据的总数
let trademarkArr = ref<Records>([]) //存储已有品牌的数据
let dialogFormVisible = ref<boolean>(false)
let trademarkParams = reactive<Trademark>({
  tmName: '',
  logoUrl: '',
})

//获取el-form组件实例
let formRef = ref()

//获取已有品牌的接口封装为一个函数
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  const res: TrademarkResData = await reqHasTrademark(pageNo.value, limit.value)
  if (res.code == 200) {
    total.value = res.data.total
    trademarkArr.value = res.data.records
  }
}
onMounted(() => {
  getHasTrademark()
})

const sizeChange = () => {
  //pageNo.value = 1 //当前页面数据量发生变化时，页码归一
  getHasTrademark()
}

//添加新品牌
const addTradeMark = () => {
  dialogFormVisible.value = true
  //收集的数据清空
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = undefined
  //第一次点击添加新品牌时，el-form组件还没有，所以是undefined，undefined身上没有clearValidate方法，会报错
  //第一种写法：ts的问号写法
  // formRef.value?.clearValidate('logoUrl')
  // formRef.value?.clearValidate('tmName')
  //第二种写法：nextTick
  nextTick(() => {
    formRef.value.clearValidate('logoUrl')
    formRef.value.clearValidate('tmName')
  })
}
//修改旧品牌
const updateTrademark = (row: any) => {
  nextTick(() => {
    formRef.value.clearValidate('logoUrl')
    formRef.value.clearValidate('tmName')
  })
  dialogFormVisible.value = true
  //方法一：
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
  // trademarkParams.id = row.id
  //方法二：以上代码可以简写（使用ES6语法合并对象）
  Object.assign(trademarkParams, row)
}
//对话框底部取消按钮
const cancel = () => {
  dialogFormVisible.value = false
}
//对话框底部确定按钮
const confirm = async () => {
  //在发请求之前，对整个表单进行校验
  await formRef.value.validate() //调用这个方法进行校验，加了await后，只有校验通过，后续语句才能执行
  const res: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (res.code == 200) {
    //关闭对话框
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    //再次发请求获取全部品牌数据（否则数据条数没更新）
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
    dialogFormVisible.value = false
  }
}
//上传图片之前触发的钩子函数，可以约束文件类型和大小
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //要求文件格式为png|jpg|gif  4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpg' ||
    rawFile.type == 'image/gif' ||
    rawFile.type == 'image/jpeg'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小不超过4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式为png|jpg|gif',
    })
    return false
  }
}
//图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  trademarkParams.logoUrl = response.data
  //图片上传成功，清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl')
}
//校验品牌名称的方法：当表单元素触发blur时，会触发此方法
const validateTmName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称必须大于等于两位'))
  }
}
//校验品牌LOGO图片的自定义规则方法
const validateLogoUrl = (rule: any, value: any, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('LOGO图片必须上传'))
  }
}
//表单校验规则
const rules = {
  tmName: [
    {
      required: true,
      trigger: 'blur', //失去焦点时触发
      validator: validateTmName,
    },
  ],
  logoUrl: [{ required: true, validator: validateLogoUrl }],
}

//删除按钮气泡确认框确认按钮触发的函数
const removeTradeMark = async (id: number) => {
  const res = await reqDeleteTrademark(id)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
