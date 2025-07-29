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
      <span class="custom-breadcrumb-separator">/</span>
      <a href="#" class="custom-breadcrumb-link custom-breadcrumb-current"
        >Chỉnh sửa địa chỉ</a
      >
    </nav>
  </div>

  <div class="container account-summary-container my-5">
    <div class="row">
      <div class="col-md-2 account-sidebar d-none d-md-block">
        <a href="/user/account">Tổng quan tài khoản</a><br />
        <a href="/user/profile">Thông tin của tôi</a><br />
        <a href="/user/change-password">Đổi mật khẩu</a><br />
        <a href="/user/listaddress" class="active">Sổ địa chỉ</a><br />
        <a href="/user/review-history">Đánh giá của tôi</a><br />
        <a href="/user/order-management">Mua hàng & Trả hàng</a><br />
        <a href="#">Danh sách yêu thích</a>
      </div>

      <div class="address-form-container col-md-10">
        <div class="mb-4">
          <h3 class="text-center fw-bold mb-3">Địa Chỉ Đặt Hàng</h3>
          <div
            class="d-flex justify-content-between flex-column flex-sm-row align-items-start align-items-sm-center mt-3"
          >
            <div>
              <h6 class="fw-bold mb-1">Cập Nhật Địa Chỉ</h6>
              <small class="text-muted">* Trường thông tin bắt buộc</small>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitForm" class="mt-4">
          <div class="row g-2 mb-3">
            <div class="col-sm-12 col-md-6 mb-2">
              <label for="customerName" class="form-label address-form-label"
                >Họ tên người nhận *</label
              >
              <input
                type="text"
                v-model="form.customerName"
                class="form-control address-form-input"
                id="customerName"
                @input="clearFieldError('customerName')"
              />

              <small v-if="errors.customerName" class="text-danger">{{
                errors.customerName
              }}</small>
            </div>

            <div class="col-sm-12 col-md-6 mb-2">
              <label for="phone" class="form-label address-form-label"
                >Số điện thoại *</label
              >
              <input
                type="text"
                v-model="form.phone"
                class="form-control address-form-input"
                id="phone"
                @input="clearFieldError('phone')"
              />

              <small v-if="errors.phone" class="text-danger">{{ errors.phone }}</small>
            </div>
          </div>

          <div class="row g-2 mb-3">
            <div class="col-sm-12 col-md-4 mb-2">
              <label class="form-label address-form-label">Tỉnh/Thành phố *</label>
              <select
                class="form-select address-form-select"
                v-model="form.provinceId"
                @change="
                  () => {
                    loadDistricts();
                    clearFieldError('provinceId');
                  }
                "
              >
                <option value="">Tỉnh/Thành</option>
                <option v-for="p in provinces" :key="p.ProvinceID" :value="p.ProvinceID">
                  {{ p.ProvinceName }}
                </option>
              </select>
              <small v-if="errors.provinceId" class="text-danger">{{
                errors.provinceId
              }}</small>
            </div>

            <div class="col-sm-12 col-md-4 mb-2">
              <label class="form-label address-form-label">Quận/Huyện *</label>
              <select
                class="form-select address-form-select"
                v-model="form.districtId"
                @change="
                  () => {
                    loadWards();
                    clearFieldError('districtId');
                  }
                "
              >
                <option value="">Quận/Huyện</option>
                <option v-for="d in districts" :key="d.DistrictID" :value="d.DistrictID">
                  {{ d.DistrictName }}
                </option>
              </select>
              <small v-if="errors.districtId" class="text-danger">{{
                errors.districtId
              }}</small>
            </div>

            <div class="col-sm-12 col-md-4 mb-2">
              <label class="form-label address-form-label">Phường/Xã *</label>
              <select
                class="form-select address-form-select"
                v-model="form.wardId"
                @change="clearFieldError('wardId')"
              >
                <option value="">Phường/Xã</option>
                <option v-for="w in wards" :key="w.WardCode" :value="w.WardCode">
                  {{ w.WardName }}
                </option>
              </select>
              <small v-if="errors.wardId" class="text-danger">{{ errors.wardId }}</small>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label address-form-label">Địa chỉ cụ thể *</label>
            <input
              type="text"
              v-model="form.address"
              class="form-control address-form-input"
              @input="clearFieldError('address')"
            />
            <small v-if="errors.address" class="text-danger">{{ errors.address }}</small>
          </div>
          <div class="mb-3 form-check">
            <input
              type="checkbox"
              class="form-check-input address-form-checkbox"
              id="defaultAddress"
              v-model="form.defaultAddress"
            />
            <label class="form-check-label" for="defaultAddress"
              >Đặt làm địa chỉ mặc định</label
            >
          </div>
          <button type="submit" class="btn address-form-btn" :disabled="isLoading">
            <span v-if="isLoading">Đang cập nhật...</span>
            <span v-else>Cập nhật địa chỉ</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const ghnToken = "b1128a4b-3c99-11f0-b2d1-fa768adb59a3";
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const isLoading = ref(false);

const route = useRoute();
const addressId = route.params.id;

const form = reactive({
  customerName: "",
  phone: "",
  provinceId: "",
  provinceName: "",
  districtId: "",
  districtName: "",
  wardId: "",
  wardName: "",
  address: "",
});

const errors = reactive({
  customerName: "",
  phone: "",
  provinceId: "",
  districtId: "",
  wardId: "",
  address: "",
});

function clearFieldError(field) {
  errors[field] = "";
}

function clearErrors() {
  Object.keys(errors).forEach((key) => (errors[key] = ""));
}

function validateForm() {
  clearErrors();
  let valid = true;

  if (!form.customerName.trim()) {
    errors.customerName = "Tên người nhận không được để trống";
    valid = false;
  } else if (form.customerName.length > 100) {
    errors.customerName = "Tên người nhận không được vượt quá 100 ký tự";
    valid = false;
  }

  if (!form.phone.trim()) {
    errors.phone = "Số điện thoại không được để trống";
    valid = false;
  } else if (!/^[0-9]{10,11}$/.test(form.phone)) {
    errors.phone = "Số điện thoại không hợp lệ";
    valid = false;
  }

  if (!form.provinceId) {
    errors.provinceId = "Tỉnh/Thành phố không được để trống";
    valid = false;
  }

  if (!form.districtId) {
    errors.districtId = "Quận/Huyện không được để trống";
    valid = false;
  }

  if (!form.wardId) {
    errors.wardId = "Phường/Xã không được để trống";
    valid = false;
  }

  if (!form.address.trim()) {
    errors.address = "Địa chỉ chi tiết không được để trống";
    valid = false;
  }

  return valid;
}

async function loadProvinces() {
  const res = await fetch(
    "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
    { headers: { Token: ghnToken } }
  );
  const data = await res.json();
  provinces.value = data.data || [];
}

async function loadDistricts() {
  wards.value = [];
  form.districtId = "";
  form.wardId = "";
  const res = await fetch(
    "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Token: ghnToken },
      body: JSON.stringify({ province_id: Number(form.provinceId) }),
    }
  );
  const data = await res.json();
  districts.value = data.data || [];
}

async function loadWards() {
  const res = await fetch(
    `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${form.districtId}`,
    { headers: { Token: ghnToken } }
  );
  const data = await res.json();
  wards.value = data.data || [];
}

async function submitForm() {
  if (!validateForm()) return;

  const Token = localStorage.getItem("token");
  if (!Token) {
    iziToast.error({
      title: "Lỗi",
      message: "Bạn chưa đăng nhập!",
      position: "topRight",
    });
    return;
  }

  isLoading.value = true; // Bật hiệu ứng loading

  const payload = {
    customerName: form.customerName,
    phone: form.phone,
    address: form.address,
    provinceId: Number(form.provinceId),
    provinceName:
      provinces.value.find((p) => p.ProvinceID == form.provinceId)?.ProvinceName || "",
    districtId: Number(form.districtId),
    districtName:
      districts.value.find((d) => d.DistrictID == form.districtId)?.DistrictName || "",
    wardId: Number(form.wardId),
    wardName: wards.value.find((w) => w.WardCode == form.wardId)?.WardName || "",
  };

  try {
    const res = await fetch(
      `http://localhost:8080/api/user/address/update/${addressId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) throw new Error("Cập nhật thất bại");

    iziToast.success({
      title: "Thành công",
      message: "Đã cập nhật địa chỉ!",
      position: "topRight",
    });

    // ⏳ Chờ 1 giây để toast hiển thị, sau đó chuyển trang (giữ nguyên loading)
    setTimeout(() => {
      window.location.href = "/user/listaddress";
    }, 1000);
  } catch (err) {
    iziToast.error({
      title: "Lỗi",
      message: "Cập nhật địa chỉ thất bại.",
      position: "topRight",
    });
    console.error(err);
    isLoading.value = false; // Chỉ tắt loading nếu bị lỗi
  }
}

function loadEditData() {
  const stored = localStorage.getItem("editAddress");
  if (!stored) return;

  const data = JSON.parse(stored);
  Object.assign(form, data);
}

onMounted(async () => {
  await loadProvinces();
  loadEditData();

  if (form.provinceId) await loadDistricts();
  if (form.districtId) await loadWards();
});
</script>

<style scoped>
.text-danger {
  color: red;
  font-size: 13px;
}
/* --- giữ nguyên style cũ đã tối ưu --- */
.address-form-container {
  width: 90%;
  max-width: 1000px;
  /* margin: 40px auto;
  font-family: Arial, sans-serif; */
}

.address-form-label {
  font-size: 14px;
  font-weight: 500;
}

.address-form-input,
.address-form-select,
.address-form-textarea {
  font-size: 14px;
  border-radius: 0;
}

.address-form-btn {
  background-color: #000;
  color: #fff;
  font-weight: 600;
  padding: 10px 20px;
  border: 1px solid #000 !important;
  transition: 0.3s ease;
}

.address-form-btn:hover {
  background-color: #fff;
  color: #000;
  border: 1px solid #000 !important;
}

.address-form-input:focus,
.address-form-select:focus,
.address-form-textarea:focus {
  border-color: #999;
  box-shadow: none !important;
}

/* Checkbox tùy chỉnh */
.address-form-checkbox {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #999;
  border-radius: 3px;
  background-color: #fff;
  cursor: pointer;
  position: relative;
}

.address-form-checkbox:checked {
  background-color: #999;
  border-color: #999;
}

.address-form-checkbox:checked::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 5px;
  width: 4px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Responsive */
@media (max-width: 576px) {
  .address-form-label,
  .address-form-input,
  .address-form-select,
  .address-form-textarea {
    font-size: 13px;
  }

  .address-form-btn {
    width: 100%;
    padding: 10px;
  }

  .address-form-checkbox {
    width: 16px;
    height: 16px;
  }
}

.address-form-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
