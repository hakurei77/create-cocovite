<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'

const $router = useRouter() //获取路由器
const $route = useRoute() //获取路由
//定义变量控制按钮加载的效果
let loading = ref(false)
let userStore = useUserStore()

//获取el-form组件
let loginForms = ref()

//收集账号与密码的数据
let loginForm = reactive({ username: 'admin', password: 'atguigu123' })

const login = async () => {
  await loginForms.value.validate()

  loading.value = true //开始加载
  //通知仓库发送请求,请求成功，跳转首页，请求失败，弹出登录失败
  try {
    await userStore.userLogin(loginForm) //如果成功返回成功的promise
    const redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI,${getTime()}好`,
    })
  } catch (error: any) {
    ElNotification({
      type: 'error',
      message: error.message,
    })
  } finally {
    //登录成功或失败，加载效果都要消失
    loading.value = false
  }
}

const validateUserName = (rule: any, value: any, callback: any) => {
  //rule即为校验规则对象
  //value即为表单元素文本内容
  //callback是一个函数，如果符合校验，callback放行通过，不符合，注入错误信息
  if (value.length >= 5 && value.length <= 10) {
    callback()
  } else {
    callback(new Error('账号长度为5-10位啊啊啊'))
  }
}
const validatePassword = (rule: any, value: any, callback: any) => {
  //rule即为校验规则对象
  //value即为表单元素文本内容
  //callback是一个函数，如果符合校验，callback放行通过，不符合，注入错误信息
  if (value.length >= 6 && value.length <= 15) {
    callback()
  } else {
    callback(new Error('账号长度为6-15位哈哈哈'))
  }
}

const rules = {
  username: [
    /*   {
      required: true, //代表这个字段必须校验
      min: 5, //代表文本至少多少位
      max: 10,
      message: '用户名长度必须为5-10位', //错误提示信息
      trigger: 'change', //触发表单校验的时机
    }, */
    {
      trigger: 'change',
      validator: validateUserName,
    },
  ],
  password: [
    /*   {
      required: true,
      min: 6,
      max: 15,
      message: '密码长度必须为6-15位',
      trigger: 'change',
    }, */
    {
      trigger: 'change',
      validator: validatePassword,
    },
  ],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
    h1 {
      color: #fff;
      font-size: 40px;
    }
    h2 {
      color: #fff;
      font-size: 20px;
      margin: 20px 0;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
