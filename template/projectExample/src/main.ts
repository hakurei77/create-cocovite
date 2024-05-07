import { createApp } from 'vue'
import App from './App.vue'
//引入element-plus 插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//配置element-plus中文
// @ts-expect-error
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//引入模版的全局样式
import '@/styles/index.scss'
// svg插件需要配置代码
import 'virtual:svg-icons-register'

import globalComponent from '@/components/index'

import router from './router'
import pinia from './store'
import './permission'
//暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)
//安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn,
})
//安装自定义插件：全局注册组件
app.use(globalComponent)
//注册模版路由
app.use(router)
//安装仓库
app.use(pinia)

//引入自定义指令文件
import { isHasButton } from '@/directive/has'
isHasButton(app)
//将应用挂载到挂载点上
app.mount('#app')
