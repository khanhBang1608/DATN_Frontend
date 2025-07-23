<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router" // ✅ Thêm dòng này
import { getAllCategories } from "@/api/adminCategoryAPI"
import { addProduct, updateProduct, getProductById } from "@/api/adminProductAPI"

const route = useRoute()
const router = useRouter() // ✅ Khởi tạo router

const isEditing = ref(false)
const productId = ref(route.query.id)

const product = ref({
  name: '',
  description: '',
  status: true,
  categoryId: ''
})

const categories = ref([])
const errorMessage = ref('')

const fetchCategories = async () => {
  try {
    categories.value = await getAllCategories()
  } catch (error) {
    errorMessage.value = '❌ Không tải được danh mục'
    console.error(error)
  }
}

const fetchProductDetail = async () => {
  try {
    product.value = await getProductById(productId.value)
  } catch (error) {
    console.error("❌ Lỗi khi tải sản phẩm:", error)
  }
}

onMounted(async () => {
  await fetchCategories()

  if (productId.value) {
    isEditing.value = true
    await fetchProductDetail()
  }
})

// ✅ Hàm xử lý submit
const handleSubmit = async () => {
  try {
    console.log("➡️ Dữ liệu gửi đi:", product.value)

    if (!product.value.name?.trim() || !product.value.categoryId) {
      alert("❗ Vui lòng nhập đầy đủ thông tin")
      return
    }

    if (isEditing.value) {
      await updateProduct(productId.value, product.value)
      alert('✅ Cập nhật sản phẩm thành công')
    } else {
      await addProduct(product.value)
      alert('✅ Thêm sản phẩm thành công')
    }

    // ✅ Quay lại trang danh sách sản phẩm
    router.push('/admin/product')
  } catch (error) {
    if (error.response && error.response.data) {
      alert(`❌ ${error.response.data}`)
    } else {
      alert("❌ Lỗi không xác định khi lưu sản phẩm.")
    }
    console.error(error)
  }
}

// ✅ Hàm xử lý nút Hủy
const handleCancel = () => {
  router.push('/admin/product')
}
</script>

<template>
  <!-- <div class="container mt-4"> -->
    <div class="card p-4">
      <div class="card-header bg-primary text-white">
        <h2 class="mb-0">{{ isEditing ? '✏️ Cập nhật sản phẩm' : '➕ Thêm sản phẩm' }}</h2>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="card-body row g-3">

          <!-- Tên sản phẩm -->
          <div class="col-md-6">
            <label class="form-label">Tên sản phẩm</label>
            <input type="text" class="form-control" v-model="product.name"/>
          </div>

          <!-- Danh mục -->
          <div class="col-md-6">
            <label class="form-label">Danh mục</label>
            <select class="form-select" v-model="product.categoryId" >
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
              <option :value="true">Đang bán</option>
              <option :value="false">Ngừng bán</option>
            </select>
          </div>
        </div>

        <div class="card-footer d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary" @click="handleCancel">
            Hủy
          </button>
          <button type="submit" class="btn btn-success">
            {{ isEditing ? 'Cập nhật' : 'Lưu' }}
          </button>
        </div>

      </form>
    </div>
  <!-- </div> -->
</template>
