<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">👤 Quản lý Tài khoản</h2>
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
                <i class="bi bi-eye-fill me-1"></i> Xem Địa chỉ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-center mt-4" v-if="totalPages > 1">
      <button
        class="btn btn-outline-secondary me-2"
        :disabled="currentPage === 0"
        @click="fetchUsers(currentPage - 1)"
      >
        &laquo; Trang trước
      </button>

      <span class="mx-2 align-self-center">
        Trang {{ currentPage + 1 }} / {{ totalPages }}
      </span>

      <button
        class="btn btn-outline-secondary ms-2"
        :disabled="currentPage >= totalPages - 1"
        @click="fetchUsers(currentPage + 1)"
      >
        Trang sau &raquo;
      </button>
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

const goToUserAddresses = (userId, userName) => {
  router.push({
    path: `/admin/users/${userId}/addresses`,
    query: { name: userName },
  });
};

const totalPages = ref(0);
const currentPage = ref(0);

const fetchUsers = async (page = 0) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/admin/users?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
