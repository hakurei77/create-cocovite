//创建用户相关的小仓库
import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type { loginFormData, userInfoResData } from '@/api/user/type'
import type { UserState } from './types/type'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
import router from '@/router'
//@ts-expect-error
import cloneDeep from 'lodash/cloneDeep'

const filterAsyncRoute = (asyncRoute: any, routes: any) => {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

const useUserStore = defineStore('User', {
  //小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute, //仓库存储生成菜单需要的数组（路由）
      username: '',
      avatar: '',
      buttons: [],
    }
  },
  //处理异步或逻辑的地方
  actions: {
    //用户登录的方法
    async userLogin(data: loginFormData) {
      //登录请求
      const res: any = await reqLogin(data)
      //请求成功：200，返回token
      console.log(res)

      if (res.code == 200) {
        this.token = res.data as string
        //由于pinia和vuex存储数据其实利用js对象，
        //为了持久化保存，需要本地存储一份
        /*   localStorage.setItem('TOKEN', res.data.token as string) */
        SET_TOKEN(res.data as string)

        return 'ok' //能保证当前的async函数返回一个成功的promise
      } else {
        //请求失败:201,返回登录失败的错误信息
        return Promise.reject(new Error(res.data))
      }
    },
    //获取用户信息
    async userInfo() {
      //获取用户信息进行存储于仓库当中（用户头像、用户名称）
      const res: userInfoResData = await reqUserInfo()
      console.log(res)
      if (res.code == 200) {
        this.username = res.data.name
        this.avatar = res.data.avatar
        this.buttons = res.data.buttons
        const userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          res.data.routes,
        )
        console.log(userAsyncRoute)
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        const addRoutes = [...userAsyncRoute, anyRoute]
        addRoutes.forEach((route) => {
          router.addRoute(route)
        })

        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
    //退出登录
    async userLogout() {
      const res: any = await reqLogout()
      if (res.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
  },
  getters: {},
})

//对外暴露获取小仓库的方法
export default useUserStore
