<template>
  <div class="container p-4 size-body">
    <div class="row">
      <!-- SIDEBAR -->
      <div class="col-md-2 account-sidebar d-none d-md-block">
        <a href="/user/account">Tổng quan tài khoản</a><br />
        <a href="/user/profile">Thông tin của tôi</a><br />
        <a href="/user/change-password">Đổi mật khẩu</a><br />
        <a href="/user/listaddress" class="active">Sổ địa chỉ</a><br />
        <a href="/user/review-history">Đánh giá của tôi</a><br />
        <a href="/user/order-management">Mua hàng & Trả hàng</a><br />
        <a href="#">Danh sách yêu thích</a>
      </div>

      <div class="col-md-10">
        <div class="text-center mb-3">
          <h2>Danh sách địa chỉ</h2>
          <p class="text-muted">Quản lý địa chỉ nhận hàng của bạn</p>
        </div>
        <div class="mb-3 text-end">
          <a href="/user/address" class="btn btn-primary">
            <i class="bi bi-plus-circle"></i> Thêm địa chỉ mới
          </a>
        </div>
        <div v-if="addresses.length === 0" class="text-muted">
          Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ để sử dụng khi đặt hàng.
        </div>
        <div v-for="address in addresses" :key="address.addressId" class="address-card">
          <h5>
            {{ address.customerName }}
            <span v-if="address.defaultAddress" class="default-label">☆ Mặc định</span>
          </h5>
          <p class="mb-1">{{ address.phone }}</p>
          <p><i class="bi bi-geo-alt"></i> {{ fullAddress(address) }}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm" @click="editAddress(address)">
              <i class="bi bi-pencil"></i> Chỉnh sửa
            </button>
            <button class="btn btn-outline-danger btn-sm" @click="deleteAddress(address.addressId)">
              <i class="bi bi-trash"></i> Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const addresses = ref([])
const token = localStorage.getItem("token")
const router = useRouter()

async function loadAddresses() {
  try {
    const res = await fetch("http://localhost:8080/api/user/address/list", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (!res.ok) throw new Error("Không thể tải danh sách địa chỉ")
    const data = await res.json()
    addresses.value = data
  } catch (err) {
    alert("Lỗi khi tải địa chỉ.")
    console.error(err)
  }
}

async function deleteAddress(id) {
  if (!id) {
    console.error("❌ Không có ID truyền vào deleteAddress");
    alert("Lỗi: Không tìm thấy ID địa chỉ để xoá");
    return;
  }

  if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;

  const url = `http://localhost:8080/api/user/address/delete/${id}`;
  const token = localStorage.getItem("token");

  console.log("✅ Gửi yêu cầu xóa địa chỉ ID:", id);
  console.log("🛡️ Token:", token);

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("📦 Response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Server trả về lỗi:", errorText);
      alert("Xoá địa chỉ thất bại: " + errorText);
      return;
    }

    alert("Đã xoá địa chỉ thành công");
    await loadAddresses(); // reload lại danh sách
  } catch (err) {
    console.error("❌ Lỗi khi gọi API xoá:", err);
    alert("Có lỗi xảy ra khi xoá địa chỉ");
  }
}



function addAddress() {
  router.push("/user/address")
}

function editAddress(address) {
  localStorage.setItem("editAddress", JSON.stringify(address));
  router.push(`/user/editaddress/${address.addressId}`); // ✅ thêm id vào URL
}




function fullAddress(addr) {
  return `${addr.address}, ${addr.wardName}, ${addr.districtName}, ${addr.provinceName}`
}

onMounted(loadAddresses)
</script>

<style scoped>
.address-card {
  background-color: #f5f9ff;
  border: 1px solid #d0e2ff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}
.default-label {
  color: #888;
  font-weight: 600;
  margin-left: 8px;
}
.size-body {
  max-width: 1200px;
  margin: 0 auto;
}
.account-sidebar a {
  display: inline-block;
  padding: 4px 0;
  font-size: 15px;
  color: #000;
  text-decoration: none;
}
.account-sidebar a:hover {
  text-decoration: underline;
}
.account-sidebar a.active {
  font-weight: 600;
}
</style>
