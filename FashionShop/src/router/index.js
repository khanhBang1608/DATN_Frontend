import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Dashboard from '@/views/DashboardView.vue'
import Promotion from '@/views/PromotionView.vue'
import Discount from '@/views/DiscountView.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import Review from '@/views/admin/ReviewView.vue'
import Order from '@/views/admin/OrderView.vue'
import Category from '@/views/CategoryView.vue'
import User from '@/views/UserView.vue'
import UserAddress from '@/views/admin/UserAddressView.vue'
import Product from '@/views/admin/ProductView.vue'
import Color from '@/views/admin/ColorView.vue'
import size from '@/views/admin/SizeView.vue'
import ProductView from '../views/ProductView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import OrderManagementView from '../views/OrderManagementView.vue'
import ReviewHistoryView from '../views/ReviewHistoryView.vue'
import CartView from '../views/CartView.vue'
import CheckOutView from '../views/CheckOutView.vue'
import ContactUsView from '../views/ContactUsView.vue'
import ProfileView from '../views/ProfileView.vue'
import AccountView from '../views/AccountView.vue'
import OrderDetailView from '@/views/OrderDetailView.vue'
import OrderDetailADminView from '@/views/admin/OrderDetailView.vue'
import ChangePasswordView from '../views/ChangePasswordView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import AddressView from '../views/AddressView.vue'
import ProductVariantList from '@/components/admin/product/ProductVariantMain.vue'
import ProductPromotions from '@/components/admin/promotions/ProductPromotions.vue'
import ListAddressView from '@/views/ListAddressView.vue'
import EditAddressView from '@/views/EditAddressView.vue'
import FavoriteView from '@/views/FavoriteView.vue'
import PaymentSuccess from '@/views/PaymentResult.vue'
import userOrder from '@/views/admin/UserOrderView.vue'
import ContactView from '@/views/ContactView.vue'
import { getProductDetail } from '@/api/ProductClient'
import ErrorView from '@/views/ErrorView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/oauth2/success',
      name: 'Oauth2Success',
      component: () => import('../views/Oauth2SuccessView.vue'),
    },
    {
      path: '/',
      name: 'index',
      component: HomeView,
    },
    {
      path: '/product',
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
      path: '/user/order-management',
      name: 'order-management',
      component: OrderManagementView,
    },
    {
      path: '/user/order-detail/:id',
      name: 'UserOrderDetail',
      component: OrderDetailView,
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
      path: '/payment-success',
      name: 'PaymentSuccess',
      component: PaymentSuccess,
    },
    {
      path: '/contact-us',
      name: 'contact-us',
      component: ContactUsView,
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
    },
    {
      path: '/user/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/user/account',
      name: 'account',
      component: AccountView,
    },
    {
      path: '/user/change-password',
      name: 'change-password',
      component: ChangePasswordView,
    },
    {
      path: '/product-detail/:id',
      name: 'product-detail',
      component: ProductDetailView,
      beforeEnter: async (to, from, next) => {
        try {
          const productId = to.params.id
          const res = await getProductDetail(productId)

          // Nếu API trả null hoặc object rỗng
          if (res.data === null || Object.keys(res.data).length === 0) {
            return next({ name: 'NotFound' })
          }

          next() // Có dữ liệu -> cho vào trang chi tiết
        } catch (err) {
          // Nếu lỗi mạng hoặc lỗi khác
          return next({ name: 'NotFound' })
        }
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: ErrorView
    },
    {
      path: '/user/address',
      name: 'address',
      component: AddressView,
    },
    {
      path: '/user/listaddress',
      name: 'listaddress',
      component: ListAddressView,
    },
    {
      path: '/user/editaddress/:id',
      name: 'editaddress',
      component: EditAddressView,
      props: true,
    },
    {
      path: '/user/favorite',
      name: 'favorite',
      component: FavoriteView,
      props: true,
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
      path: '/logout',
      name: 'logout',
      beforeEnter: (to, from, next) => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        // Nếu bạn lưu thêm thông tin user, có thể xoá thêm:
        localStorage.removeItem('user')

        // Chuyển hướng đến trang login
        next('/login')
      },
    },

    {
      path: '/admin',
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
          name: 'AdminReview',
          component: Review,
        },
        {
          path: 'product',
          name: 'Product',
          component: Product,
        },
        {
          path: 'attribute/colors',
          name: 'Color',
          component: Color,
        },
        {
          path: 'attribute/sizes',
          name: 'size',
          component: size,
        },
        {
          path: 'product/:id/variants',
          name: 'ProductVariantList',
          component: ProductVariantList,
        },
        {
          path: 'ProductPromotions/:promotionId',
          name: 'ProductPromotions',
          component: ProductPromotions,
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
          path: 'order/:orderId',
          name: 'OrderDetail',
          component: OrderDetailADminView,
        },
        {
          path: 'user',
          name: 'User',
          component: User,
        },
        {
          path: 'user/order/:userId',
          name: 'userOrder',
          component: userOrder,
        },
        {
          path: '/admin/users/:id/addresses',
          name: 'UserAddress',
          component: UserAddress,
        },
      ],
    },
  ],
})
//  Hàm lấy thông tin user từ localStorage
// Hàm lấy role người dùng
function getUserRole() {
  try {
    return localStorage.getItem('role') ?? null
  } catch {
    return null
  }
}

// Hàm kiểm tra token hết hạn
function isTokenExpired() {
  const expiresAt = localStorage.getItem('tokenExpiresAt')
  return !expiresAt || Date.now() > Number(expiresAt)
}

// Navigation Guard kiểm tra phân quyền truy cập
router.beforeEach((to, from, next) => {
  const role = getUserRole() // "0" = Admin, "1" = User
  const isLoggedIn = role !== null && !isTokenExpired()

  // Nếu token hết hạn -> xóa localStorage và điều hướng đến login
  if (isTokenExpired()) {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('tokenExpiresAt')
    localStorage.removeItem('user')
  }

  // Chưa đăng nhập hoặc token hết hạn
  if (!isLoggedIn) {
    if (to.path.startsWith('/admin') || to.path.startsWith('/user')) {
      return next({
        path: '/login',
        query: { redirect: to.fullPath }, // Gửi thông tin redirect qua URL
      });
    } else {
      return next();
    }
  }


  // Đã đăng nhập nhưng phân quyền sai
  if (role === '0' && to.path.startsWith('/user')) {
    return next('/login') // Admin không vào trang user
  }
  if (role === '1' && to.path.startsWith('/admin')) {
    return next('/login') // User không vào trang admin
  }

  next() // Hợp lệ, cho phép vào
})
export default router
