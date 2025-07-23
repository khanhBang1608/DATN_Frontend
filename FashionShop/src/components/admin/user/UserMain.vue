<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">👤 Quản lý Tài khoản</h2>
      <!-- <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addUserModal"
      >
        + Thêm tài khoản
      </button> -->
    </div>
    <div class="table-responsive">
      <table
        id="userTable"
        class="table table-hover align-middle text-light custom-table"
      >
        <thead class="table-dark">
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
              <!-- <button class="btn btn-sm btn-warning m-1" @click="openEditStatus(user)">
                ✏️ Sửa
              </button> -->
              <button class="btn btn-sm btn-info m-1">📍 Địa chỉ</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const token = localStorage.getItem("token");
const users = ref([]);
const errorMessage = ref("");

const fetchUsers = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    users.value = res.data;
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
