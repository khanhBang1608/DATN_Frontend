<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"

const token = localStorage.getItem("token")

const products = ref([])
const showForm = ref(false)

const productForm = ref({
  id: null,
  name: "",
  description: "",
  status: 1,
  categoryId: null
})

const isEditing = ref(false)

</script>
<template>
  <div class="container mt-4">
    <!-- Form thêm / sửa sản phẩm -->
    <div class="card mt-4" v-if="showForm">
      <div class="card-header bg-primary text-white">
        {{ isEditing ? '✏️ Cập nhật sản phẩm' : '➕ Thêm sản phẩm' }}
      </div>
      <form @submit.prevent="saveProduct">
        <div class="card-body row g-3">
          <div class="col-md-6 mb-3">
            <label class="form-label">Tên sản phẩm</label>
            <input type="text" class="form-control" v-model="productForm.name" required />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Danh mục phụ</label>
            <select class="form-select" v-model="productForm.categoryId" required>
              <option value="">-- Chọn --</option>
              <option value="1">Giày / Thể thao</option>
              <!-- Có thể map danh mục thật nếu muốn -->
            </select>
          </div>
          <div class="col-md-12 mb-3">
            <label class="form-label">Mô tả</label>
            <textarea class="form-control" rows="3" v-model="productForm.description"></textarea>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Trạng thái</label>
            <select class="form-select" v-model="productForm.status">
              <option value="1">Đang bán</option>
              <option value="0">Ngừng bán</option>
            </select>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-between">
          <button type="submit" class="btn btn-success">
            {{ isEditing ? 'Cập nhật' : 'Lưu' }}
          </button>
          <button type="button" class="btn btn-secondary" @click="cancelForm">Hủy</button>
        </div>
      </form>
    </div>
  </div>
</template>
