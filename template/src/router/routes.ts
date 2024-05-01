//对外暴露配置路由（常量路由）
export const constantRoute = [
    {
        path:'/',
        component:() => import('@/views/homePage/index.vue'),
        name:'layout',
    },
    {
        path:'/404',
        component:() => import('@/views/404/index.vue'),
        name:'404',
    },
    {
        path:'/:pathMatch(.*)*',
        redirect:'/404',
        name:'Any',
    }
]