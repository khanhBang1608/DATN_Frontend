<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const token = localStorage.getItem("token");

// Khai báo các biến dữ liệu để hiển thị
const stats = ref({
  totalUsers: 0,
  totalCategories: 0,
  totalProducts: 0,
  totalOrders: 0,
  totalReviews: 0,
  totalRevenue: 0
});

const monthlyRevenue = ref([]);

// Gọi API khi component được mount
const fetchDashboardStats = async () => {
  try {
    const res = await axios.get("/api/admin/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    stats.value = res.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thống kê:", error);
  }
};
const fetchMonthlyRevenue = async () => {
  try {
    const res = await axios.get("/api/admin/dashboard/stats/monthly-revenue", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    monthlyRevenue.value = res.data;
    renderRevenueChart();
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu theo tháng:", error);
  }
};
onMounted(() => {
  fetchDashboardStats();
  fetchMonthlyRevenue();
});

</script>
<template>
  <div id="contents">
    <div class="welcome">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <div class="content">
              <h2>Chào mừng đến với trang quản trị</h2>
              <div class="row">
                <div class="col-md-6">
                  <label for="">Từ ngày</label>
                  <input type="date" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label for="">Đến ngày</label>
                  <input type="date" class="form-control" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Section -->
    <section class="statistics">
      <div class="container-fluid">
        <div class="row">
          <!-- Tổng đánh giá -->
          <div class="col-md-4">
            <div class="box">
              <i class="fa fa-envelope fa-fw bg-primary"></i>
              <div class="info">
                <h3>{{ stats.totalReviews }}</h3>
                <span> Đánh giá</span>
                <p>Tổng đánh giá sản phẩm</p>
              </div>
            </div>
          </div>

          <!-- Tổng danh mục -->
          <div class="col-md-4">
            <div class="box">
              <i class="fa fa-file fa-fw danger"></i>
              <div class="info">
                <h3>{{ stats.totalCategories }}</h3>
                <span> Danh mục</span>
                <p>Các loại sản phẩm</p>
              </div>
            </div>
          </div>

          <!-- Tổng người dùng -->
          <div class="col-md-4">
            <div class="box">
              <i class="fa fa-users fa-fw success"></i>
              <div class="info">
                <h3>{{ stats.totalUsers }}</h3>
                <span> Người dùng</span>
                <p>Chạy chiến dịch</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Charts -->
    <section class="charts">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6">
            <div class="chart-container">
              <h3>Sản phẩm yêu thích</h3>
              <canvas id="myChart"></canvas>
            </div>
          </div>
          <div class="col-md-6">
            <div class="chart-container">
              <h3>Doanh thu theo tháng</h3>
              <canvas id="myChart2"></canvas>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tổng đơn hàng, sản phẩm, doanh thu -->
    <section class="statis text-center">
      <div class="container-fluid">
        <div class="row">
          <!-- Tổng đơn hàng -->
          <div class="col-md">
            <div class="box danger">
              <i class="fa fa-user-o"></i>
              <h3>{{ stats.totalOrders }}</h3>
              <p class="lead">Đơn hàng</p>
            </div>
          </div>

          <!-- Tổng sản phẩm -->
          <div class="col-md">
            <div class="box warning">
              <i class="fa fa-shopping-cart"></i>
              <h3>{{ stats.totalProducts }}</h3>
              <p class="lead">Sản phẩm</p>
            </div>
          </div>

          <!-- Doanh thu -->
          <div class="col-md">
            <div class="box success">
              <i class="fa fa-handshake-o"></i>
              <h3>{{ stats.totalRevenue.toLocaleString('vi-VN') }}₫</h3>
              <p class="lead">Doanh Thu</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

