import { createRouter, createWebHistory } from 'vue-router'
import IconView from "../views/IconView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'icon',
      component: IconView
    },
    {
      path: '/button',
      name: 'button',
      component: () => import('../views/ButtonView.vue')
    }
  ],
  linkActiveClass:'active'
})

export default router
