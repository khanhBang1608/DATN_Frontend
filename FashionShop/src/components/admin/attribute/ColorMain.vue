<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const token = localStorage.getItem("token");

const colors = ref([]);
const newColor = ref({ colorName: "" });
const editColor = ref({ colorId: null, colorName: "" });
const formErrors = ref({
  add: { name: "" },
  edit: { name: "" },
});

const searchKeyword = ref(""); //tu can tim

const currentPage = ref(0);
const pageSize = 8;
const totalItems = ref(0);
const totalPages = ref(0);

// Lấy danh sách màu có phân trang
const fetchColors = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/admin/attributes/colors?page=${currentPage.value}&size=${pageSize}&search=${searchKeyword.value}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    colors.value = res.data.content;
    totalItems.value = res.data.totalElements;
    totalPages.value = res.data.totalPages;
    currentPage.value = res.data.number;
  } catch (err) {
    iziToast.error({
      title: "Lỗi",
      message: "Không thể tải màu.",
      position: "topRight",
    });
  }
};

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    fetchColors();
  }
};

const validateColorForm = (form) => {
  formErrors.value.name = "";
  if (!form.colorName || form.colorName.trim() === "") {
    formErrors.value.name = "Tên màu không được để trống";
    return false;
  }
  return true;
};

const createColor = async () => {
  if (!validateColorForm(newColor.value)) return;

  try {
    await axios.post(
      "http://localhost:8080/api/admin/attributes/colors",
      newColor.value,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    iziToast.success({
      title: "Thành công",
      message: "Tạo màu thành công",
      position: "topRight",
    });
    await fetchColors();
    document.getElementById("addColorModalClose").click();
    newColor.value = { colorName: "" };
  } catch (err) {
    iziToast.error({
      title: "Lỗi",
      message: err.response?.data || "Không thể tạo màu",
      position: "topRight",
    });
  }
};

const openEditColor = (color) => {
  editColor.value = { ...color };
  formErrors.value.name = "";
};

const updateColor = async () => {
  if (!validateColorForm(editColor.value)) return;

  try {
    await axios.put(
      `http://localhost:8080/api/admin/attributes/colors/${editColor.value.colorId}`,
      editColor.value,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    iziToast.success({
      title: "Thành công",
      message: "Cập nhật màu thành công",
      position: "topRight",
    });
    await fetchColors();
    document.getElementById("editColorModalClose").click();
  } catch (err) {
    iziToast.error({
      title: "Lỗi",
      message: err.response?.data || "Không thể cập nhật màu",
      position: "topRight",
    });
  }
};

const deleteColor = async (id) => {
  const result = await Swal.fire({
    title: "Bạn có chắc chắn?",
    text: "Màu này sẽ bị xoá vĩnh viễn!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:8080/api/admin/attributes/colors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Gọi lại fetch để biết totalPages mới
      await fetchColors();

      // Nếu currentPage hiện tại > totalPages - 1 => lùi về trang cuối cùng
      if (currentPage.value >= totalPages.value && totalPages.value > 0) {
        currentPage.value = totalPages.value - 1;
        await fetchColors();
      }

      iziToast.success({
        title: "Thành công",
        message: "Màu đã được xoá.",
        position: "topRight",
      });
    } catch (err) {
      iziToast.error({
        title: "Lỗi",
        message: err.response?.data || "Xoá màu thất bại!",
        position: "topRight",
      });
    }
  }
};

const clearSearch = () => {
  searchKeyword.value = "";
  fetchColors();
};

// Reset form khi modal đóng
onMounted(() => {
  fetchColors();

  const addModal = document.getElementById("addColorModal");
  const editModal = document.getElementById("editColorModal");

  addModal?.addEventListener("hidden.bs.modal", () => {
    newColor.value = { colorName: "" };
    formErrors.value.name = "";
  });

  editModal?.addEventListener("hidden.bs.modal", () => {
    editColor.value = { colorId: null, colorName: "" };
    formErrors.value.name = "";
  });
});
</script>

<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>🎨 Danh sách Màu</h2>

      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addColorModal"
      >
        + Thêm màu
      </button>
    </div>
    <div class="d-flex align-items-center gap-2 flex-wrap mb-3">
      <input
        type="text"
        v-model="searchKeyword"
        class="form-control form-control-sm"
        placeholder="🔍 Nhập tên màu..."
        @keyup.enter="fetchColors"
        style="max-width: 250px"
      />
      <button
        class="btn btn-outline-secondary btn-sm"
        @click="fetchColors"
        title="Tìm kiếm"
      >
        🔍 Tìm
      </button>
      <button
        class="btn btn-outline-danger btn-sm"
        @click="clearSearch"
        title="Xoá bộ lọc"
      >
        ❌ Xóa
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle text-light custom-table">
        <thead>
          <tr>
            <th style="width: 50px">STT</th>
            <th>Tên màu</th>
            <th style="width: 160px" class="text-end">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(color, index) in colors" :key="color.colorId">
            <td>{{ currentPage * pageSize + index + 1 }}</td>
            <td>{{ color.colorName }}</td>
            <td class="text-end">
              <button
                class="btn btn-warning btn-sm me-1"
                data-bs-toggle="modal"
                data-bs-target="#editColorModal"
                @click="openEditColor(color)"
              >
                ✏️ Sửa
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteColor(color.colorId)">
                🗑️ Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="admin-pagination">
      <div
        class="admin-button admin-prev"
        :class="{ disabled: currentPage === 0 }"
        @click="changePage(currentPage - 1)"
      >
        &lt; prev
      </div>
      <div
        v-for="page in totalPages"
        :key="page"
        class="admin-page"
        :class="{ active: currentPage === page - 1 }"
        @click="changePage(page - 1)"
      >
        {{ page }}
      </div>
      <div
        class="admin-button admin-next"
        :class="{ disabled: currentPage + 1 >= totalPages }"
        @click="changePage(currentPage + 1)"
      >
        next &gt;
      </div>
    </div>
  </div>

  <!-- Modal Thêm -->
  <div class="modal fade" id="addColorModal" tabindex="-1">
    <div class="modal-dialog">
      <form @submit.prevent="createColor" class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">Thêm Màu</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            id="addColorModalClose"
          ></button>
        </div>
        <div class="modal-body">
          <label class="form-label">Tên màu:</label>
          <input
            v-model="newColor.colorName"
            @input="formErrors.name = ''"
            class="form-control mb-2"
          />

          <div v-if="formErrors.name" class="text-danger small mb-2">
            {{ formErrors.name }}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Đóng
          </button>
          <button class="btn btn-success">Thêm mới</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal Sửa -->
  <div class="modal fade" id="editColorModal" tabindex="-1">
    <div class="modal-dialog">
      <form @submit.prevent="updateColor" class="modal-content">
        <div class="modal-header bg-warning text-white">
          <h5 class="modal-title">Sửa Màu</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            id="editColorModalClose"
          ></button>
        </div>
        <div class="modal-body">
          <label class="form-label">Tên màu:</label>
          <input
            v-model="editColor.colorName"
            @input="formErrors.name = ''"
            class="form-control mb-2"
          />

          <div v-if="formErrors.name" class="text-danger small mb-2">
            {{ formErrors.name }}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Đóng
          </button>
          <button class="btn btn-success">Cập nhật</button>
        </div>
      </form>
    </div>
  </div>
</template>
