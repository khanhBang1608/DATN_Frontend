<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const token = localStorage.getItem("token")
const promotionId = route.params.promotionId
const id = route.params.id // lấy id nếu đang sửa


const allProducts = ref([])
const selectedProductIds = ref([])
const allVariantsMap = ref({})
const selectedVariants = ref({})

// 1. Lấy tất cả sản phẩm
const fetchAllProducts = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/admin/products', {
      headers: { Authorization: `Bearer ${token}` }
    })
    allProducts.value = res.data
  } catch (err) {
    console.error('Lỗi khi tải danh sách sản phẩm:', err)
  }
}

// 2. Lấy biến thể cho từng sản phẩm
const fetchVariantsByProductId = async (productId) => {
  try {
    const res = await axios.get('http://localhost:8080/api/admin/product-promotions/productVariants', {
      params: { productId },
      headers: { Authorization: `Bearer ${token}` }
    })

    allVariantsMap.value[productId] = res.data

    res.data.forEach(variant => {
      if (!selectedVariants.value[variant.productVariantId]) {
        selectedVariants.value[variant.productVariantId] = {
          checked: false,
          promotionQuantity: 0
        }
      }
    })
  } catch (err) {
    console.error(`Lỗi khi tải biến thể cho sản phẩm ${productId}:`, err)
  }
}
const loadEditData = async () => {
  if (!id) return

  try {
    const res = await axios.get(`http://localhost:8080/api/admin/product-promotions/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = res.data

    // Gán biến thể được chọn & số lượng
    selectedProductIds.value = [] // Không cần product, chỉ cần load variant
    selectedVariants.value[data.productVariantId] = {
      checked: true,
      promotionQuantity: data.quantityLimit
    }

    // Gọi API lấy thông tin biến thể từ variantId → để biết productId
    const variantRes = await axios.get(`http://localhost:8080/api/admin/product-variants/${data.productVariantId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const variant = variantRes.data
    const productId = variant.productId

    selectedProductIds.value.push(productId)

    // Lấy danh sách biến thể cho productId này
    await fetchVariantsByProductId(productId)
  } catch (err) {
    console.error("Lỗi khi load dữ liệu sửa:", err)
  }
}


// 3. Theo dõi sản phẩm được chọn → lấy biến thể
watch(selectedProductIds, (newIds) => {
  newIds.forEach(productId => {
    if (!allVariantsMap.value[productId]) {
      fetchVariantsByProductId(productId)
    }
  })
})

onMounted(() => {
  fetchAllProducts()
  loadEditData()
})


// 5. Gửi danh sách biến thể + số lượng về backend
const submitPromotionVariants = async () => {
  const selectedList = []

  for (const [variantId, value] of Object.entries(selectedVariants.value)) {
    if (value.checked && value.promotionQuantity > 0) {
      selectedList.push({
        productVariantId: parseInt(variantId),
        promotionId: parseInt(promotionId),
        quantityLimit: value.promotionQuantity
      })
    }
  }

  if (selectedList.length === 0) {
    alert("Vui lòng chọn ít nhất 1 biến thể với số lượng khuyến mãi.")
    return
  }

  try {
    if (id) {
        // Chỉ update 1 item thôi
        const item = selectedList[0]
        await axios.put(`http://localhost:8080/api/admin/product-promotions/${id}`, item, {
            headers: { Authorization: `Bearer ${token}` },
            'Content-Type': 'application/json'
        })
        alert("Cập nhật thành công!")
    } else {
        await axios.post(`http://localhost:8080/api/admin/product-promotions`, selectedList, {
            headers: { Authorization: `Bearer ${token}` },
            'Content-Type': 'application/json'
        })
        alert("Đã lưu khuyến mãi thành công!")
    }

  } catch (err) {
    console.error("Lỗi khi lưu khuyến mãi:", err)
    alert("Lỗi khi lưu khuyến mãi.")
  }
}

// Tiện ích: lấy tên sản phẩm từ productId
const getProductName = (productId) => {
  const product = allProducts.value.find(p => p.productId == productId)
  return product ? product.name : 'Không rõ'
}


</script>

<template>
  <div class="container mt-4">
    <h3>Chọn sản phẩm và biến thể để áp dụng khuyến mãi</h3>

    <!-- Chọn nhiều sản phẩm -->
    <div class="form-group mb-3">
      <label>Chọn sản phẩm</label>
      <select v-model="selectedProductIds" class="form-control" multiple>
        <option
          v-for="product in allProducts"
          :key="product.productId"
          :value="product.productId"
        >
          {{ product.name }}
        </option>
      </select>
    </div>

    <!-- Hiển thị biến thể cho từng sản phẩm -->
    <div
      v-for="productId in selectedProductIds"
      :key="productId"
      class="mt-4"
    >
      <h5>Biến thể của sản phẩm: {{ getProductName(productId) }}</h5>

      <div v-if="allVariantsMap[productId]?.length">
        <div
          v-for="variant in allVariantsMap[productId]"
          :key="variant.productVariantId"
          class="variant-box mb-3 p-3 border rounded shadow-sm"
        >
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="checkbox"
              :id="'variant-' + variant.productVariantId"
              v-model="selectedVariants[variant.productVariantId].checked"
            />
            <label class="form-check-label" :for="'variant-' + variant.productVariantId">
              <strong>Màu:</strong> {{ variant.colorName || 'Không có' }} -
              <strong>Size:</strong> {{ variant.sizeName || 'Không có' }} -
              <strong>Giá:</strong> {{ variant.price }} -
              <strong>Tồn kho:</strong> {{ variant.stock }}
            </label>
          </div>

          <div
            v-if="selectedVariants[variant.productVariantId].checked"
            class="form-group mt-2"
          >
            <label>Số lượng khuyến mãi</label>
            <input
              type="number"
              min="0"
              class="form-control"
              v-model.number="selectedVariants[variant.productVariantId].promotionQuantity"
            />
          </div>
        </div>
      </div>
    </div>

    <button class="btn btn-success mt-3" @click="submitPromotionVariants">
      Lưu khuyến mãi
    </button>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
}
.variant-box {
  background: #f8f9fa;
}
select[multiple] {
  height: 150px;
}
</style>
