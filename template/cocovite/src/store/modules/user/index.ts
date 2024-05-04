import { defineStore } from 'pinia';
export const useUserStore = defineStore('user', {
    //小仓库存储数据地方
    state: () =>{
        return {

        }
    },
    actions:{

    },
    getters:{

    }
})
//对外暴露获取小仓库方法
export default useUserStore;

