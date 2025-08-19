<template>
  <div class="custom-breadcrumb-wrapper">
    <nav class="custom-breadcrumb container">
      <a href="#" class="custom-breadcrumb-link">Trang chủ</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="/user/account" class="custom-breadcrumb-link custom-breadcrumb-current"
        >Tổng quan tài khoản</a
      >
      <span class="custom-breadcrumb-separator">/</span>
      <a href="#" class="custom-breadcrumb-link custom-breadcrumb-current">Sổ địa chỉ</a>
    </nav>
  </div>
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

      <div class="address-container col-md-10">
        <div class="text-center mb-3">
          <h3 class="text-center profile-title">Sổ Địa Chỉ</h3>
          <p class="text-muted">Quản lý địa chỉ nhận hàng của bạn</p>
        </div>
        <div class="mb-3 text-start">
          <a href="/user/address" class="btn custom-address-btn"> Thêm mới </a>
        </div>
        <div v-if="addresses.length === 0" class="text-muted text-center">
          Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ để sử dụng khi đặt hàng.
        </div>
        <div class="row g-3">
          <div class="col-md-6" v-for="address in addresses" :key="address.addressId">
            <div class="address-card h-100 position-relative">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="d-flex py-2">
                  <!-- <div class="form-check me-2">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="address.defaultAddress"
                      disabled
                    />
                  </div> -->
                  <div>
                    <strong>{{ address.customerName }}</strong
                    ><br />
                    {{ fullAddress(address) }}<br />
                    <span>{{ address.phone }}</span>
                  </div>
                </div>

                <div class="d-flex flex-column align-items-end gap-1">
                  <a
                    href="#"
                    class="text-muted small"
                    @click.prevent="editAddress(address)"
                  >
                    Chỉnh sửa
                  </a>
                  <i
                    class="bi bi-trash text-danger"
                    style="cursor: pointer"
                    @click="deleteAddress(address.addressId)"
                  ></i>
                </div>
              </div>

              <!-- <label class="custom-checkbox">
                <input type="checkbox" checked />
                <span class="checkmark"></span>
                Sử dụng địa chỉ này làm địa chỉ thanh toán mặc định của tôi
              </label> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const addresses = ref([]);
const token = localStorage.getItem("token");
const router = useRouter();

async function loadAddresses() {
  try {
    const res = await fetch("http://localhost:8080/api/user/address/list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Không thể tải danh sách địa chỉ");
    const data = await res.json();
    addresses.value = data;
  } catch (err) {
    iziToast.error({
      title: "Lỗi",
      message: "Không thể tải danh sách địa chỉ",
      position: "topRight",
    });
    console.error(err);
  }
}

async function deleteAddress(id) {
  if (!id) {
    iziToast.error({
      title: "Lỗi",
      message: "Không có ID địa chỉ để xoá",
      position: "topRight",
    });
    console.error("❌ Không có ID truyền vào deleteAddress");
    return;
  }

  const result = await Swal.fire({
    title: "Xác nhận xoá?",
    text: "Bạn có chắc muốn xoá địa chỉ này không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
  });

  if (!result.isConfirmed) return;

  const url = `http://localhost:8080/api/user/address/delete/${id}`;

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      iziToast.error({
        title: "Xoá thất bại",
        message: errorText,
        position: "topRight",
      });
      return;
    }

    iziToast.success({
      title: "Thành công",
      message: "Đã xoá địa chỉ thành công",
      position: "topRight",
    });
    await loadAddresses(); // Reload danh sách
  } catch (err) {
    iziToast.error({
      title: "Lỗi",
      message: "Có lỗi xảy ra khi xoá địa chỉ",
      position: "topRight",
    });
    console.error("❌ Lỗi khi gọi API xoá:", err);
  }
}

function addAddress() {
  router.push("/user/address");
}

function editAddress(address) {
  localStorage.setItem("editAddress", JSON.stringify(address));
  router.push(`/user/editaddress/${address.addressId}`);
}

function fullAddress(addr) {
  return `${addr.address}, ${addr.wardName}, ${addr.districtName}, ${addr.provinceName}`;
}

onMounted(loadAddresses);
</script>

<style scoped>
.address-card {
  background-color: #fff;
  border: 1px solid #ccc;
  /* border-radius: 6px; */
  padding: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.address-card:hover {
  border-color: #999;
}

.form-check-label {
  font-size: 14px;
}

.bi-trash {
  font-size: 16px;
}

.text-muted.small {
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  color: #000;
  gap: 8px;
}

/* Ẩn checkbox mặc định */
.custom-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Tạo checkbox tùy chỉnh */
.custom-checkbox .checkmark {
  width: 16px;
  height: 16px;
  background-color: white;
  border: 1px solid black;
  display: inline-block;
  position: relative;
}

/* Hiển thị dấu check khi được chọn */
.custom-checkbox input:checked + .checkmark::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 0px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox input:checked + .checkmark {
  background-color: black;
}

.custom-address-btn {
  background-color: #fff;
  border: 1px solid #000;
  color: #000;
  transition: all 0.3s ease;
}

.custom-address-btn:hover {
  background-color: #000;
  border: 1px solid #fff;
  color: #fff;
}
</style>
