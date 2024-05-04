import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//@ts-ignore 
import zhCn from 'element-plus/es/locale/lang/zh-cn.mjs'
import 'virtual:svg-icons-register'
import globalComponent from '@/components'
import '@/styles/index.scss'
import router from '@/router'
import pinia from './store'
createApp(App).use(ElementPlus,{ locale: zhCn }).use(globalComponent).use(router).use(pinia).mount('#app')

