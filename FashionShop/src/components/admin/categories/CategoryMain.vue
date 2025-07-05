<script setup>
import { ref, onMounted, nextTick } from "vue";
import axios from "axios";

const token = localStorage.getItem('token')

console.log(token)

const form = ref({
  id: null,
  name: "",
  status: true,
});

const errors = ref({});
const categories = ref([]);
const modalTitle = ref("");
const isFormVisible = ref(false);

const fetchCategories = async () => {
  try {
    // Tạm thời bỏ xử lý liên quan đến DataTable
    // if ($.fn.DataTable.isDataTable("#categoryTable")) {
    //   $("#categoryTable").DataTable().destroy();
    // }

    const res = await axios.get("http://localhost:8080/api/admin/category", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    categories.value = res.data;

    // Tạm thời không cần init lại DataTable
    // await nextTick();
    // initDataTable();

    console.log("Dữ liệu categories:", categories.value);
  } catch (err) {
    console.log("Lỗi khi fetch categories:", err);
  }
};
onMounted(fetchCategories);

// ... các hàm khác giữ nguyên
</script>

<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">📁 Quản lý Danh mục</h2>
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addCategoryModal"
      >
        + Thêm danh mục
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle text-light custom-table">
        <thead class="table-dark">
          <tr>
            <th>STT</th>
            <th>Tên danh mục</th>
            <th>Loại</th>
            <th>Trạng thái</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in categories" :key="item.categoryId">
            <td>{{ index + 1 }}</td>
            <td>{{ item.categoryName }}</td>
            <td>
              <span v-if="item.parentId === null">Danh mục cha</span>
              <span v-else>Danh mục con</span>
            </td>
            <td>
              <span class="badge" :class="item.status ? 'bg-success' : 'bg-secondary'">
                {{ item.status ? "Hiển thị" : "Ẩn" }}
              </span>
            </td>
            <td class="text-center">
              <button class="btn btn-sm btn-warning m-1">✏️ Sửa</button>
              <button class="btn btn-sm btn-danger m-1">🗑️ Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
