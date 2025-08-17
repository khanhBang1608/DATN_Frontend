<template>
  <div class="card p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">📍 Địa chỉ của {{ userName }}</h2>
    </div>
    <div v-if="addresses.length > 0" class="table-responsive">
      <table
        class="table table-bordered table-hover align-middle text-light custom-table"
      >
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>SĐT</th>
            <th>Địa chỉ chi tiết</th>
            <th>Phường/Xã</th>
            <th>Quận/Huyện</th>
            <th>Tỉnh/TP</th>
            <th>Địa chỉ đầy đủ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(addr, index) in addresses" :key="addr.addressId">
            <td>{{ index + 1 }}</td>
            <td>{{ addr.customerName }}</td>
            <td>{{ addr.phone }}</td>
            <td>{{ addr.address }}</td>
            <td>{{ addr.wardName }}</td>
            <td>{{ addr.districtName }}</td>
            <td>{{ addr.provinceName }}</td>
            <td>{{ addr.fullAddress }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="text-center text-white fs-5">
      <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
      Không có địa chỉ nào được tìm thấy.
    </p>
  </div>
  <div class="d-flex justify-content-end mt-3">
    <button class="btn btn-link text-white" @click="$router.back()">Quay về</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import iziToast from "izitoast";

const token = localStorage.getItem("token");
const route = useRoute();
const userId = route.params.id;
const userName = ref(route.query.name || "Người dùng");
const addresses = ref([]);

const fetchAddresses = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/admin/users/${userId}/addresses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    addresses.value = res.data;
  } catch (err) {
    iziToast.error({
      title: "Lỗi",
      message: "Không thể tải địa chỉ người dùng: " + (err.response?.data || err.message),
      position: "topRight",
    });
  }
};

onMounted(fetchAddresses);
</script>
