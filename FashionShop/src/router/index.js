import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import OtpFormView from '../views/OtpFormView.vue'
import OrderManagementView from '../views/OrderManagementView.vue'
import ReviewHistoryView from '../views/ReviewHistoryView.vue'
import CartView from '../views/CartView.vue'
import CheckOutView from '../views/CheckOutView.vue'
import ContactUsView from '../views/ContactUsView.vue'
import ProfileView from '../views/ProfileView.vue'
import ChangePasswordView from '../views/ChangePasswordView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import AddressView from '../views/AddressView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: HomeView,
    },
    {
      path: '/user/product',
      name: 'product',
      component: ProductView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/register/otp',
      name: 'registerOtp',
      component: OtpFormView,
    },
    {
      path: '/order-management',
      name: 'order-management',
      component: OrderManagementView,
    },
    {
      path: '/user/review-history',
      name: 'review-history',
      component: ReviewHistoryView,
    },
    {
      path: '/user/cart',
      name: 'cart',
      component: CartView,
    },
    {
      path: '/user/checkout',
      name: 'checkout',
      component: CheckOutView,
    },
    {
      path: '/contact-us',
      name: 'contact-us',
      component: ContactUsView,
    },
    {
      path: '/user/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/user/change-password',
      name: 'change-password',
      component: ChangePasswordView,
    },
    {
      path: '/user/product-detail',
      name: 'product-detail',
      component: ProductDetailView,
    },
    {
      path: '/user/address',
      name: 'address',
      component: AddressView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
