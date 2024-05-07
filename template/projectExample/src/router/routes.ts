//对外暴露配置路由
//(常量路由)
export const constantRoute = [
  {
    path: '/login',
    component: () => import('@/views/Login/index.vue'),
    name: 'login', //命名路由
    meta: { title: '登录', hidden: true, icon: 'Promotion' }, //title:菜单标题  hidden:代表路由在菜单中是否隐藏
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout', //命名路由
    meta: { title: '', hidden: false, icon: '' },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/Home/index.vue'),
        meta: { title: '主页', hidden: false, icon: 'HomeFilled' },
      },
    ],
  },

  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404', //命名路由
    meta: { title: '404', hidden: true, icon: 'DocumentDelete' },
  },
  {
    path: '/screen',
    component: () => import('@/views/Screen/index.vue'),
    name: 'Screen',
    meta: { title: '数据大屏', icon: 'Platform' },
  },
]
//异步路由
export const asyncRoute = [
  {
    path: '/acl',
    component: () => import('@/layout/index.vue'),
    name: 'Acl',
    meta: { title: '权限管理', icon: 'Lock' },
    redirect: '/acl/user',
    children: [
      {
        path: '/acl/user',
        component: () => import('@/views/Acl/User/index.vue'),
        name: 'User',
        meta: { title: '用户管理', icon: 'User' },
      },
      {
        path: '/acl/role',
        component: () => import('@/views/Acl/Role/index.vue'),
        name: 'Role',
        meta: { title: '角色管理', hidden: false, icon: 'UserFilled' },
      },
      {
        path: '/acl/permission',
        component: () => import('@/views/Acl/Permission/index.vue'),
        name: 'Permission',
        meta: { title: '菜单权限管理', hidden: false, icon: 'Grid' },
      },
    ],
  },
  {
    path: '/product',
    component: () => import('@/layout/index.vue'),
    name: 'Product',
    meta: { title: '商品管理', icon: 'Goods' },
    redirect: '/product/trademark',
    children: [
      {
        path: '/product/trademark',
        component: () => import('@/views/Product/Trademark/index.vue'),
        name: 'Trademark',
        meta: { title: '品牌管理', icon: 'ShoppingTrolley' },
      },
      {
        path: '/product/attr',
        component: () => import('@/views/Product/Attr/index.vue'),
        name: 'Attr',
        meta: { title: '属性管理', icon: 'ChromeFilled' },
      },
      {
        path: '/product/spu',
        component: () => import('@/views/Product/Spu/index.vue'),
        name: 'Spu',
        meta: { title: 'spu管理', hidden: false, icon: 'Flag' },
      },
      {
        path: '/product/sku',
        component: () => import('@/views/Product/Sku/index.vue'),
        name: 'Sku',
        meta: { title: 'sku管理', hidden: false, icon: 'Briefcase' },
      },
    ],
  },
]
//任意路由
export const anyRoute = {
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  name: 'Any',
  meta: { title: '任意路由', hidden: true, icon: 'DataLine' },
}
