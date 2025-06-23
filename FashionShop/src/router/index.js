import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Dashboard from '@/views/DashboardView.vue'
import Promotion from '@/views/PromotionView.vue'
import Discount from '@/views/DiscountView.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import Review from '@/views/ReviewView.vue'
import Order from '@/views/OrderView.vue'
import Category from '@/views/CategoryView.vue'
import User from '@/views/UserView.vue'
import Product from '@/views/ProductView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/',
      component: AdminLayout,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
        },
        {
          path: 'discount',
          name: 'Discount',
          component: Discount,
        },
        {
          path: 'promotion',
          name: 'Promotion',
          component: Promotion,
        },
            {
          path: 'review',
          name: 'Review',
          component: Review,
        },
         {
          path: 'product',
          name: 'Product',
          component: Product,
        },
        {
          path: 'category',
          name: 'Category',
          component: Category,
        },
        {
          path: 'order',
          name: 'Order',
          component: Order,
        },
           {
          path: 'user',
          name: 'User',
          component: User,
        }
      ],
    },
  ],
})

export default router
