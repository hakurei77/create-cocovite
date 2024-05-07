//路由鉴权，项目中路由能不能被访问的权限设置
import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import useUserStore from './store/modules/user'
import pinia from './store'
import setting from './setting'
const userStore = useUserStore(pinia)

//全局守卫：项目当中任意路由切换都会触发的钩子

//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = setting.title + '-' + to.meta.title
  //to:你将要访问的哪个路由
  //from:你从哪个路由来
  //next:路由的放行函数
  nprogress.start()
  //获取token,判断用户是否登录
  const token = userStore.token
  //获取用户的名字
  const username = userStore.username
  if (token) {
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      //登录成功，访问其余6个路由（排除登录页）
      if (username) {
        next()
      } else {
        //如果没有用户信息，在守卫这里发请求获取到了用户信息再放行
        try {
          await userStore.userInfo()
          //如果点刷新的页面是异步路由，有可能获取到用户信息时，异步路由还没加载完毕，出现空白效果
          next({ ...to, replace: true })
        } catch (error) {
          //token过期，获取不到用户信息或用户手动修改本地存储信息
          //第一步：退出登录
          await userStore.userLogout()
          //第二步，跳转登录页面
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
//全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})
