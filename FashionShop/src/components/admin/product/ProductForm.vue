<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import axios from "axios"

const route = useRoute()
const isEditing = ref(false) // true nếu đang sửa
const productId = ref(route.query.id) // lấy id từ URL

const product = ref({
  name: '',
  description: '',
  status: 1,
  categoryId: ''
})

const categories = ref([])
const errorMessage = ref('')
const token = localStorage.getItem('token') // Lấy token từ localStorage

const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/admin/category', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    categories.value = response.data
    console.log('Danh sách danh mục:', categories.value)
  } catch (error) {
    console.error('Lỗi khi tải danh mục:', error)
    errorMessage.value = 'Lỗi khi tải danh mục'
  }
}


// Nếu có ID => đang sửa => load dữ liệu từ API
onMounted(async () => {
  await fetchCategories() // luôn fetch danh mục khi mounted

  if (productId.value) {
    isEditing.value = true
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/products/${productId.value}`)
      product.value = response.data
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error)
    }
  }
})

// Hàm xử lý khi submit form
const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      // gọi API cập nhật sản phẩm
      await axios.put(`http://localhost:8080/api/admin/products/${productId.value}`, product.value)
      alert('✅ Cập nhật sản phẩm thành công')
    } else {
      // gọi API thêm sản phẩm
      await axios.post(`http://localhost:8080/api/admin/products`, product.value)
      alert('✅ Thêm sản phẩm thành công')
    }
  } catch (error) {
    console.error("Lỗi khi gửi dữ liệu:", error)
    alert("❌ Đã xảy ra lỗi")
  }
}
</script>


<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">{{ isEditing ? '✏️ Cập nhật sản phẩm' : '➕ Thêm sản phẩm' }}</h5>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="card-body row g-3">

          <!-- Tên sản phẩm -->
          <div class="col-md-6">
            <label class="form-label">Tên sản phẩm</label>
            <input type="text" class="form-control" v-model="product.name" required />
          </div>

          <!-- Danh mục -->
          <div class="col-md-6">
            <label class="form-label">Danh mục</label>
            <select class="form-select" v-model="product.categoryId" required>
              <option value="">-- Chọn danh mục --</option>
              <optgroup
                v-for="cat in categories"
                :key="cat.categoryId"
                :label="cat.categoryName"
              >
                <option
                  v-for="child in cat.children"
                  :key="child.categoryId"
                  :value="child.categoryId"
                >
                  {{ child.categoryName }}
                </option>
              </optgroup>
            </select>
          </div>
          <!-- Mô tả -->
          <div class="col-md-12">
            <label class="form-label">Mô tả</label>
            <textarea class="form-control" rows="3" v-model="product.description" placeholder="Nhập mô tả..."></textarea>
          </div>

          <!-- Trạng thái -->
          <div class="col-md-6">
            <label class="form-label">Trạng thái</label>
            <select class="form-select" v-model="product.status">
              <option value="1">Đang bán</option>
              <option value="0">Ngừng bán</option>
            </select>
          </div>
        </div>

        <div class="card-footer d-flex justify-content-end">
          <button type="submit" class="btn btn-success">
            {{ isEditing ? 'Cập nhật' : 'Lưu' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
