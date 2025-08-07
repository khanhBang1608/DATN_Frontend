<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const token = localStorage.getItem("token");

const stats = ref({
  totalUsers: 0,
  totalCategories: 0,
  totalProducts: 0,
  totalOrders: 0,
  totalReviews: 0,
  totalRevenue: 0,
});

const monthlyRevenue = ref([]);
const monthlyUserRegistrations = ref([]);

const fetchDashboardStats = async () => {
  try {
    const res = await axios.get("/api/admin/dashboard/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    stats.value = res.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thống kê:", error);
  }
};

const fetchMonthlyRevenue = async () => {
  try {
    const res = await axios.get("/api/admin/dashboard/stats/monthly-revenue", {
      headers: { Authorization: `Bearer ${token}` },
    });
    monthlyRevenue.value = res.data;
    drawRevenueChart(); // Vẽ biểu đồ sau khi load xong
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu theo tháng:", error);
  }
};

const fetchMonthlyUserRegistrations = async () => {
  try {
    const res = await axios.get("/api/admin/dashboard/stats/monthly-user-registrations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    monthlyUserRegistrations.value = res.data;
    drawUserChart(); // Vẽ biểu đồ sau khi load xong
  } catch (error) {
    console.error("Lỗi khi lấy thống kê người dùng theo tháng:", error);
  }
};

onMounted(() => {
  fetchDashboardStats();
  fetchMonthlyRevenue();
  fetchMonthlyUserRegistrations();
});

// 🧠 Hàm vẽ biểu đồ người dùng
const drawUserChart = () => {
  const ctx = document.getElementById("userChart");
  if (!ctx) return;

  const labels = monthlyUserRegistrations.value.map((item) => item.monthYear);
  const data = monthlyUserRegistrations.value.map((item) => item.userCount);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Người dùng đăng ký",
        data,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        },
      },
    },
  });
};

// 🧠 Hàm vẽ biểu đồ doanh thu
const drawRevenueChart = () => {
  const ctx = document.getElementById("myChart2");
  if (!ctx) return;

  const labels = monthlyRevenue.value.map((item) => `Tháng ${item.month}`);
  const data = monthlyRevenue.value.map((item) => item.revenue);

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Doanh thu (VNĐ)",
        data,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => value.toLocaleString("vi-VN"),
          },
        },
      },
    },
  });
};
</script>
<template>
  <div id="contents">
    <div class="welcome">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <div class="content">
              <h2>Chào mừng đến với trang quản trị</h2>
              <!-- <div class="row">
                <div class="col-md-6">
                  <label for="">Từ ngày</label>
                  <input type="date" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label for="">Đến ngày</label>
                  <input type="date" class="form-control" />
                </div>
              </div> -->
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
              <h3>Người dùng đăng ký theo tháng</h3>
              <canvas id="userChart"></canvas>
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
              <h3>{{ stats.totalRevenue.toLocaleString("vi-VN") }}₫</h3>
              <p class="lead">Doanh Thu</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
