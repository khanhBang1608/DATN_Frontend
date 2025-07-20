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
import Product from '@/views/admin/ProductView.vue'
import ProductFrom from '@/views/admin/ProductFormViews.vue'
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
import AccountView from '../views/AccountView.vue'
import ChangePasswordView from '../views/ChangePasswordView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import AddressView from '../views/AddressView.vue'
import DiscountForm from '../components/admin/discounts/DiscountModal.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/oauth2/success",
      name: "Oauth2Success",
      component: () => import("../views/Oauth2SuccessView.vue"),
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
      path: '/register/otp',
      name: 'registerOtp',
      component: OtpFormView,
    },
    {
      path: '/user/order-management',
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
    },
    {
      path: '/user/address',
      name: 'address',
      component: AddressView,
    },
    {
      path: '/admin/discount/form',
      name: 'discountForm',
      component: DiscountForm, 
    },
    {
      path: '/admin/discount/form/:id',
      name: 'discountFormUpdate',
      component: DiscountForm,
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
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        // Nếu bạn lưu thêm thông tin user, có thể xoá thêm:
        localStorage.removeItem("user");

        // Chuyển hướng đến trang login
        next('/login');
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
          name: 'Review',
          component: Review,
        },
         {
          path: 'product',
          name: 'Product',
          component: Product,
        },
        {
          path: 'product/form',
          name: 'ProductFrom',
          component: ProductFrom,
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
//  Hàm lấy thông tin user từ localStorage
function getUserRole() {
  try {
    const role = (localStorage.getItem("role"));
    return role ?? null;
  } catch {
    return null;
  }
}

// Navigation Guard kiểm tra phân quyền truy cập
router.beforeEach((to, from, next) => {
  const role = getUserRole(); // 0 = Admin, 1 = User
  const isLoggedIn = role !== null;

  // Nếu chưa đăng nhập
  if (!isLoggedIn) {
    if (to.path.startsWith("/admin") || to.path.startsWith("/user")) {
      return next("/login");
    } else {
      return next(); // Cho vào các trang public
    }
  }

  // Nếu đã đăng nhập
  if (role === 0 && to.path.startsWith("/user")) {
    // Admin không được vào trang user
    return next("/login");
  }

  if (role === 1 && to.path.startsWith("/admin")) {
    // User không được vào trang admin
    return next("/login");
  }

  return next(); // Các trường hợp còn lại được phép
});
export default router
