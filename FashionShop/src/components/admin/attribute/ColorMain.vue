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
const formErrors = ref({ name: "" });

const fetchColors = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/admin/attributes/colors", {
      headers: { Authorization: `Bearer ${token}` },
    });
    colors.value = res.data;
  } catch (err) {
    iziToast.error({ title: "Lỗi", message: "Không thể tải màu.", position: "topRight" });
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
    await axios.post("http://localhost:8080/api/admin/attributes/colors", newColor.value, {
      headers: { Authorization: `Bearer ${token}` },
    });

    iziToast.success({ title: "Thành công", message: "Tạo màu thành công", position: "topRight" });
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

    iziToast.success({ title: "Thành công", message: "Cập nhật màu thành công", position: "topRight" });
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

      await fetchColors(); // Cập nhật lại danh sách sau khi xoá
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

onMounted(fetchColors);
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
            <td>{{ index + 1 }}</td>
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
          <input v-model="newColor.colorName" class="form-control mb-2" />
          <div v-if="formErrors.name" class="text-danger small mb-2">
            {{ formErrors.name }}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success">Thêm mới</button>
          <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
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
          <input v-model="editColor.colorName" class="form-control mb-2" />
          <div v-if="formErrors.name" class="text-danger small mb-2">
            {{ formErrors.name }}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-success">Cập nhật</button>
          <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
        </div>
      </form>
    </div>
  </div>
</template>
