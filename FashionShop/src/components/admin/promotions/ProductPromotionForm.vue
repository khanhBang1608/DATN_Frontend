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
    alert('Không thể tải danh sách sản phẩm. Vui lòng thử lại.')
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
    alert(`Không thể tải biến thể cho sản phẩm ${productId}.`)
  }
}

// 3. Load dữ liệu khi sửa
const loadEditData = async () => {
  if (!id) return

  try {
    const res = await axios.get(`http://localhost:8080/api/admin/product-promotions/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = res.data

    // Gán biến thể được chọn & số lượng
    selectedProductIds.value = []
    selectedVariants.value[data.productVariantId] = {
      checked: true,
      promotionQuantity: data.quantityLimit
    }

    // Lấy thông tin biến thể từ variantId → để biết productId
    const variantRes = await axios.get(`http://localhost:8080/api/admin/product-variants/${data.productVariantId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const variant = variantRes.data
    const productId = variant.productId

    selectedProductIds.value.push(productId)
    await fetchVariantsByProductId(productId)
  } catch (err) {
    console.error("Lỗi khi load dữ liệu sửa:", err)
    alert('Không thể tải dữ liệu khuyến mãi. Vui lòng thử lại.')
  }
}

// 4. Theo dõi sản phẩm được chọn → lấy biến thể
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

  // Thu thập các biến thể được chọn
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
    alert('Vui lòng chọn ít nhất 1 biến thể với số lượng khuyến mãi lớn hơn 0.')
    return
  }

  // Kiểm tra số lượng khuyến mãi không vượt quá tồn kho
  const invalidVariants = []
  for (const item of selectedList) {
    const variant = Object.values(allVariantsMap.value)
      .flat()
      .find(v => v.productVariantId === item.productVariantId)
    if (variant && item.quantityLimit > variant.stock) {
      invalidVariants.push({
        id: item.productVariantId,
        color: variant.colorName || 'Không có',
        size: variant.sizeName || 'Không có',
        stock: variant.stock,
        quantity: item.quantityLimit
      })
    }
  }

  if (invalidVariants.length > 0) {
    const errorMessage = invalidVariants
      .map(v => `Biến thể ${v.id} (Màu: ${v.color}, Size: ${v.size}): Số lượng khuyến mãi (${v.quantity}) vượt quá tồn kho (${v.stock}).`)
      .join('\n')
    alert(`Lỗi: Số lượng khuyến mãi không hợp lệ:\n${errorMessage}`)
    return
  }

  try {
    if (id) {
      // Chỉ update 1 item
      const item = selectedList[0]
      const response = await axios.put(`http://localhost:8080/api/admin/product-promotions/${id}`, item, {
        headers: { Authorization: `Bearer ${token}` },
        'Content-Type': 'application/json'
      })
      if (!response.data) {
        alert(`Không thể cập nhật: Biến thể ${item.productVariantId} đã có khuyến mãi trùng thời gian.`)
        return
      }
      alert("Cập nhật khuyến mãi thành công!")
    } else {
      // Gửi danh sách biến thể
      const response = await axios.post(`http://localhost:8080/api/admin/product-promotions`, selectedList, {
        headers: { Authorization: `Bearer ${token}` },
        'Content-Type': 'application/json'
      })

      const savedVariants = response.data
      const savedVariantIds = savedVariants.map(item => item.productVariantId)
      const failedVariants = selectedList.filter(item => !savedVariantIds.includes(item.productVariantId))

      if (savedVariants.length === 0) {
        alert('Không thể lưu: Tất cả biến thể đã có khuyến mãi trùng thời gian.')
        return
      }

      let message = savedVariants.length > 0 ? `Đã lưu thành công ${savedVariants.length} biến thể.\n` : ''
      if (failedVariants.length > 0) {
        const failedDetails = failedVariants.map(item => {
          const variant = Object.values(allVariantsMap.value)
            .flat()
            .find(v => v.productVariantId === item.productVariantId)
          return `Biến thể ${item.productVariantId} (Màu: ${variant?.colorName || 'Không có'}, Size: ${variant?.sizeName || 'Không có'})`
        }).join(', ')
        message += `Các biến thể sau không được lưu do trùng thời gian khuyến mãi: ${failedDetails}.`
      }
      alert(message)
    }
  } catch (err) {
    console.error("Lỗi khi lưu khuyến mãi:", err)
    if (err.response?.status === 400) {
      alert('Không thể lưu: Một hoặc nhiều biến thể đã có khuyến mãi trùng thời gian.')
    } else {
      alert('Lỗi khi lưu khuyến mãi. Vui lòng thử lại.')
    }
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
              :max="variant.stock"
              class="form-control"
              v-model.number="selectedVariants[variant.productVariantId].promotionQuantity"
            />
          </div>
        </div>
      </div>
      <div v-else class="alert alert-warning">
        Không có biến thể nào cho sản phẩm này.
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
