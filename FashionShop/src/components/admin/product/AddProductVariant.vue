<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const productId = route.params.id;
const variantId = route.params.variantId || null;
const token = localStorage.getItem("token") || "";

const variant = ref({
  colorId: "",
  sizeId: "",
  price: null,
  stock: 0,
  image: null,
  imageName: "",
});

const colors = ref([]);
const sizes = ref([]);
const errorMessage = ref("");
const isEdit = ref(false);

const fetchColorsAndSizes = async () => {
  try {
    const colorRes = await axios.get("http://localhost:8080/api/admin/colors", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const sizeRes = await axios.get("http://localhost:8080/api/admin/sizes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    colors.value = colorRes.data;
    sizes.value = sizeRes.data;
  } catch (error) {
    console.error(error);
    errorMessage.value = "❌ Không thể tải dữ liệu màu sắc và size từ server";
  }
};

const fetchVariantDetail = async () => {
  if (!variantId) return;
  isEdit.value = true;
  try {
    const response = await axios.get(
      `http://localhost:8080/api/admin/product-variants/${variantId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = response.data;
    variant.value = {
      colorId: data.colorId ?? null,
      sizeId: data.sizeId ?? null,
      price: data.price,
      stock: data.stock,
      image: null,
      imageName: data.imageName,
    };
  } catch (error) {
    console.error(error);
    errorMessage.value = "❌ Không thể tải dữ liệu biến thể";
  }
};

onMounted(async () => {
  await fetchColorsAndSizes();
  await fetchVariantDetail();
});

const handleSubmit = async () => {
  // Kiểm tra nếu màu hoặc size bị trống
  if (!variant.value.colorId || !variant.value.sizeId) {
    errorMessage.value = "❌ Vui lòng chọn cả màu sắc và size!";
    return;
  }

  try {
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("colorId", variant.value.colorId);
    formData.append("sizeId", variant.value.sizeId);
    formData.append("price", variant.value.price);
    formData.append("stock", variant.value.stock);

    if (variant.value.image) {
      formData.append("image", variant.value.image);
    }

    if (isEdit.value) {
      await axios.put(
        `http://localhost:8080/api/admin/product-variants/update/${variantId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("✅ Cập nhật biến thể thành công");
    } else {
      await axios.post("http://localhost:8080/api/admin/product-variants", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Thêm biến thể thành công");
    }

    router.push(`/admin/product/${productId}/variants`);
  } catch (error) {
    console.error(error);
    alert("❌ Lỗi khi gửi dữ liệu: " + (error.response?.data || "Không rõ nguyên nhân"));
  }
};
</script>

<template>
  <div class="container mt-4">
    <h4>{{ isEdit ? "✏️ Cập nhật" : "➕ Thêm" }} biến thể sản phẩm #{{ productId }}</h4>

    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleSubmit" class="row g-3 mt-3">
      <div class="col-md-6">
        <label class="form-label">Màu sắc</label>
        <select class="form-select" v-model="variant.colorId">
          <option value="">-- Chọn màu --</option>
          <option v-for="color in colors" :key="color.colorId" :value="color.colorId">
            {{ color.colorName }}
          </option>
        </select>
      </div>

      <div class="col-md-6">
        <label class="form-label">Size</label>
        <select class="form-select" v-model="variant.sizeId">
          <option value="">-- Không có --</option>
          <option v-for="size in sizes" :key="size.sizeId" :value="size.sizeId">
            {{ size.sizeName }}
          </option>
        </select>
      </div>

      <div class="col-md-6">
        <label class="form-label">Giá</label>
        <input type="number" class="form-control" v-model="variant.price" />
      </div>

      <div class="col-md-6">
        <label class="form-label">Tồn kho</label>
        <input type="number" class="form-control" v-model="variant.stock" />
      </div>

      <div class="col-md-12">
        <label class="form-label">Ảnh</label>
        <input
          type="file"
          class="form-control"
          @change="(e) => (variant.image = e.target.files[0])"
        />
        <div v-if="isEdit && variant.imageName" class="mt-2">
          <p>Ảnh hiện tại:</p>
          <img :src="`http://localhost:8080/images/${variant.imageName}`" width="100" />
        </div>
      </div>

      <div class="col-12 d-flex justify-content-end">
        <button class="btn btn-secondary me-2" @click.prevent="router.back()">Hủy</button>
        <button class="btn btn-success" type="submit">
          {{ isEdit ? "Cập nhật" : "Lưu" }}
        </button>
      </div>
    </form>
  </div>
</template>
