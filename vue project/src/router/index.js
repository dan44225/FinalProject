import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FullScreenLayout from '@/layouts/FullScreenLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/',
      component: FullScreenLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/LoginView.vue'),
        },
      ],
    },
    {
      path: '/',
      component: DashboardLayout,
      children: [
        {
          path: 'home',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'inventory',
          name: 'inventory',
          component: () => import('@/views/ProductInventoryView.vue'),
        },
        {
          path: 'product-transaction',
          name: 'product-transaction',
          component: () => import('@/views/ProductTransaction.vue'),
        },
        {
          path: 'product-inventory',
          name: 'product-inventory',
          component: () => import('@/views/Product.vue'),
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
        },
      ],
    },
  ],
})

export default router
