<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">👤 Quản lý Tài khoản</h2>
    </div>
    <div class="mb-4 admin-date-filter">
      <label class="form-label">Ngày tạo</label>
      <div class="d-flex align-items-center w-50">
        <input
          type="date"
          class="admin-date-input"
          v-model="fromDate"
          placeholder="Ngày"
          @change="
            resetFiltersExcept('search');
            resetAndFetch();
          "
        />
        <span class="mx-2">Đến</span>
        <input
          type="date"
          class="admin-date-input"
          v-model="toDate"
          placeholder="Ngày"
          @change="
            resetFiltersExcept('search');
            resetAndFetch();
          "
        />
      </div>
    </div>

    <!-- Hàng 1: Loại tìm kiếm, Từ khóa, Trạng thái -->
    <div class="row mb-3">
      <div class="col-md-3">
        <label class="form-label">Loại tìm kiếm</label>
        <div class="admin-search-box">
          <select
            class="admin-select"
            v-model="searchType"
            @change="
              resetFiltersExcept('search');
              resetAndFetch();
            "
          >
            <option value="name">Tìm theo họ tên</option>
            <option value="email">Tìm theo email</option>
          </select>
        </div>
      </div>

      <div class="col-md-5">
        <label class="form-label">Từ khóa</label>
        <div class="admin-search-box">
          <input
            type="text"
            class="admin-search-text"
            :placeholder="searchType === 'name' ? 'Nhập họ tên...' : 'Nhập email...'"
            v-model="searchQuery"
            @input="
              resetFiltersExcept('search');
              resetAndFetch();
            "
          />
          <i class="bi bi-search admin-search-icon"></i>
        </div>
      </div>

      <div class="col-md-4">
        <label class="form-label">Trạng thái</label>
        <div class="admin-search-box">
          <select
            class="admin-select"
            v-model="statusFilter"
            @change="
              resetFiltersExcept('status');
              resetAndFetch();
            "
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Hoạt động</option>
            <option value="false">Bị khóa</option>
          </select>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <table
        id="userTable"
        class="table table-hover align-middle text-light custom-table"
      >
        <thead>
          <tr>
            <th>STT</th>
            <th>Ảnh</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="users.length === 0">
            <td colspan="7" class="text-center text-white fs-5 py-4">
              <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
              Không có người dùng nào được tìm thấy.
            </td>
          </tr>
          <tr v-for="(user, index) in users" :key="user.id">
            <td>{{ index + 1 }}</td>
            <td>
              <img
                :src="user.avatar || 'https://via.placeholder.com/50'"
                alt="Avatar"
                width="50"
                height="50"
                class="rounded-circle"
              />
            </td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <select
                class="form-select form-select-sm text-light"
                style="background-color: #2a2b3d; border-color: #2a2b3d"
                v-model="user.status"
                @change="updateUserStatus(user)"
              >
                <option :value="true">Hoạt động</option>
                <option :value="false">Bị khóa</option>
              </select>
            </td>

            <td>{{ formatDate(user.createdAt) }}</td>
            <td class="text-center">
              <button
                class="btn btn-sm btn-info m-1"
                @click="goToUserAddresses(user.id, user.name)"
              >
                <i class="bi bi-eye-fill me-1"></i> Xem địa chỉ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="admin-pagination" v-if="totalPages > 1">
      <!-- Prev -->
      <div
        class="admin-button admin-prev"
        :class="{ disabled: currentPage === 0 }"
        @click="currentPage > 0 && fetchUsers(currentPage - 1)"
      >
        &lt; prev
      </div>

      <!-- Số trang -->
      <div
        v-for="page in totalPages"
        :key="page"
        class="admin-page"
        :class="{ active: currentPage === page - 1 }"
        @click="fetchUsers(page - 1)"
      >
        {{ page }}
      </div>

      <!-- Next -->
      <div
        class="admin-button admin-next"
        :class="{ disabled: currentPage + 1 >= totalPages }"
        @click="currentPage + 1 < totalPages && fetchUsers(currentPage + 1)"
      >
        next &gt;
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const token = localStorage.getItem("token");
const users = ref([]);
const errorMessage = ref("");
const router = useRouter();

const searchType = ref("name"); // Mặc định tìm theo tên
const searchQuery = ref(""); // Thanh tìm kiếm duy nhất
const fromDate = ref("");
const toDate = ref("");
const statusFilter = ref("");

const goToUserAddresses = (userId, userName) => {
  router.push({
    path: `/admin/users/${userId}/addresses`,
    query: { name: userName },
  });
};

const totalPages = ref();
const currentPage = ref(1);

const resetFiltersExcept = (keep) => {
  if (keep !== "search") {
    searchQuery.value = "";
    fromDate.value = "";
    toDate.value = "";
    searchType.value = "name";
  }
  if (keep !== "status") {
    statusFilter.value = "";
  }
};

const resetAndFetch = () => {
  currentPage.value = 0;
  fetchUsers(0);
};

const fetchUsers = async (page = 0) => {
  try {
    let url = `http://localhost:8080/api/admin/users?page=${page}&size=8`;
    if (searchQuery.value) {
      if (searchType.value === "name") {
        url += `&name=${searchQuery.value}`;
      } else if (searchType.value === "email") {
        url += `&email=${searchQuery.value}`;
      }
    }
    if (fromDate.value) url += `&fromDate=${fromDate.value}`;
    if (toDate.value) url += `&toDate=${toDate.value}`;
    if (statusFilter.value !== "") {
      url += `&status=${statusFilter.value}`;
    }

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    users.value = res.data.users;
    totalPages.value = res.data.totalPages;
    currentPage.value = res.data.currentPage;
  } catch (err) {
    const message =
      "Không thể tải danh sách người dùng: " + (err.response?.data || err.message);
    errorMessage.value = message;
    iziToast.error({
      title: "Lỗi",
      message,
      position: "topRight",
    });
  }
};

const updateUserStatus = async (user) => {
  try {
    await axios.put(
      `http://localhost:8080/api/admin/users/update-status/${user.id}`,
      { status: user.status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    iziToast.success({
      title: "Thành công",
      message: "Cập nhật trạng thái người dùng thành công!",
      position: "topRight",
    });

    await fetchUsers();
  } catch (err) {
    iziToast.error({
      title: "Lỗi",
      message: "Cập nhật trạng thái thất bại: " + (err.response?.data || err.message),
      position: "topRight",
    });
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "--";
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? "Ngày không hợp lệ"
    : date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
};

onMounted(fetchUsers);
</script>
