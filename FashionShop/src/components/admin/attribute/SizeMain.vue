<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const token = localStorage.getItem("token");

const sizes = ref([]);
const newSize = ref({ sizeName: "" });
const editSize = ref({ sizeId: null, sizeName: "" });
const formErrors = ref({ name: "" });

const searchKeyword = ref("");
const currentPage = ref(0);
const pageSize = 10;
const totalPages = ref(0);
const totalItems = ref(0);

// debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Fetch sizes
const fetchSizes = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/admin/attributes/sizes?page=${currentPage.value}&size=${pageSize}&search=${searchKeyword.value}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    sizes.value = res.data.content;
    totalPages.value = res.data.totalPages;
    totalItems.value = res.data.totalElements;
    currentPage.value = res.data.number;
  } catch (err) {
    iziToast.error({
      title: "Lỗi",
      message: "Không thể tải kích thước.",
      position: "topRight",
    });
  }
};

// Gọi API với debounce khi search
const debouncedFetchSizes = debounce(fetchSizes, 100);

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    fetchSizes();
  }
};

// Thêm hàm mới để reset trang và gọi tìm kiếm
const onSearchInput = () => {
  currentPage.value = 0; // Luôn về trang đầu tiên
  debouncedFetchSizes();
};

const validateSizeForm = (form) => {
  formErrors.value.name = "";
  if (!form.sizeName || form.sizeName.trim() === "") {
    formErrors.value.name = "Tên kích thước không được để trống";
    return false;
  }
  return true;
};

const createSize = async () => {
  if (!validateSizeForm(newSize.value)) return;
  try {
    await axios.post("http://localhost:8080/api/admin/attributes/sizes", newSize.value, {
      headers: { Authorization: `Bearer ${token}` },
    });
    iziToast.success({
      title: "Thành công",
      message: "Tạo kích thước thành công",
      position: "topRight",
    });
    await fetchSizes();
    document.getElementById("addSizeModalClose").click();
    newSize.value = { sizeName: "" };
  } catch (err) {
    iziToast.error({
      title: "Lỗi",
      message: err.response?.data || "Không thể tạo kích thước",
      position: "topRight",
    });
  }
};

const openEditSize = (size) => {
  editSize.value = { ...size };
  formErrors.value.name = "";
};

const updateSize = async () => {
  if (!validateSizeForm(editSize.value)) return;
  try {
    await axios.put(
      `http://localhost:8080/api/admin/attributes/sizes/${editSize.value.sizeId}`,
      editSize.value,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    iziToast.success({
      title: "Thành công",
      message: "Cập nhật kích thước thành công",
      position: "topRight",
    });
    await fetchSizes();
    document.getElementById("editSizeModalClose").click();
  } catch (err) {
    iziToast.error({
      title: "Lỗi",
      message: err.response?.data || "Không thể cập nhật kích thước",
      position: "topRight",
    });
  }
};

const deleteSize = async (id) => {
  const result = await Swal.fire({
    title: "Bạn có chắc chắn?",
    text: "Kích thước này sẽ bị xoá vĩnh viễn!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:8080/api/admin/attributes/sizes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Nếu trong trang hiện tại chỉ còn 1 item và không phải trang đầu -> quay về trang trước
      if (sizes.value.length === 1 && currentPage.value > 0) {
        currentPage.value--;
      }

      await fetchSizes();

      iziToast.success({
        title: "Thành công",
        message: "Kích thước đã được xoá.",
        position: "topRight",
      });
    } catch (err) {
      iziToast.error({
        title: "Lỗi",
        message: err.response?.data || "Xoá kích thước thất bại!",
        position: "topRight",
      });
    }
  }
};

onMounted(() => {
  fetchSizes();

  const addModal = document.getElementById("addSizeModal");
  const editModal = document.getElementById("editSizeModal");

  addModal?.addEventListener("hidden.bs.modal", () => {
    newSize.value = { sizeName: "" };
    formErrors.value.name = "";
  });

  editModal?.addEventListener("hidden.bs.modal", () => {
    editSize.value = { sizeId: null, sizeName: "" };
    formErrors.value.name = "";
  });
});
</script>

<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>📏 Danh sách Kích thước</h2>
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addSizeModal"
      >
        <i class="bi bi-plus-circle"></i> Thêm kích thước
      </button>
    </div>
    <div class="d-flex align-items-center gap-2 flex-wrap mb-3">
      <div class="admin-search-box">
        <!-- Input tìm kiếm -->
        <input
          type="text"
          v-model="searchKeyword"
          class="admin-search-text"
          placeholder="Nhập tên kích thước..."
          @input="onSearchInput"
        />

        <i class="bi bi-search admin-search-icon"></i>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle text-light custom-table">
        <thead>
          <tr>
            <th style="width: 50px">STT</th>
            <th>Tên kích thước</th>
            <th style="width: 160px" class="text-end">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(size, index) in sizes" :key="size.sizeId">
            <td>{{ currentPage * pageSize + index + 1 }}</td>
            <td>{{ size.sizeName }}</td>
            <td class="text-end">
              <button
                class="btn btn-warning btn-sm me-1"
                data-bs-toggle="modal"
                data-bs-target="#editSizeModal"
                @click="openEditSize(size)"
              >
                <i class="bi bi-pencil-square"></i> Sửa
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteSize(size.sizeId)">
                <i class="bi bi-trash"></i> Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination -->
    <div class="admin-pagination" v-if="totalItems > pageSize">
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
  <div class="modal fade" id="addSizeModal" tabindex="-1">
    <div class="modal-dialog">
      <form @submit.prevent="createSize" class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">Thêm Kích thước</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            id="addSizeModalClose"
          ></button>
        </div>
        <div class="modal-body">
          <label class="form-label">Tên kích thước:</label>
          <input
            v-model="newSize.sizeName"
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
  <div class="modal fade" id="editSizeModal" tabindex="-1">
    <div class="modal-dialog">
      <form @submit.prevent="updateSize" class="modal-content">
        <div class="modal-header bg-warning text-white">
          <h5 class="modal-title">Sửa Kích thước</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            id="editSizeModalClose"
          ></button>
        </div>
        <div class="modal-body">
          <label class="form-label">Tên kích thước:</label>
          <input
            v-model="editSize.sizeName"
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
