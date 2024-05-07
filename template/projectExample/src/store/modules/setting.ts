//小仓库L:layout组件相关配置仓库

import { defineStore } from 'pinia'

const useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, //用于控制菜单折叠还是收起的控制
      refresh: false, //用于控制刷新效果
    }
  },
})

export default useLayoutSettingStore
