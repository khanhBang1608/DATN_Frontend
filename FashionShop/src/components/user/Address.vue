<template>
  <div class="custom-breadcrumb-wrapper">
    <nav class="custom-breadcrumb container">
      <a href="#" class="custom-breadcrumb-link">Trang chủ</a>
      <span class="custom-breadcrumb-separator">/</span>
      <a href="/user/account" class="custom-breadcrumb-link custom-breadcrumb-current"
        >Tổng quan tài khoản</a
      >
      <span class="custom-breadcrumb-separator">/</span>
      <a href="#" class="custom-breadcrumb-link custom-breadcrumb-current"
        >Địa chỉ đặt hàng</a
      >
    </nav>
  </div>
  <div class="container account-summary-container my-5">
    <div class="row">
      <div class="col-md-2 account-sidebar d-none d-md-block">
        <a href="/user/account">Tổng quan tài khoản</a><br />
        <a href="/user/profile">Thông tin của tôi</a><br />
        <a href="/user/change-password">Đổi mật khẩu</a><br />
        <a href="#" class="active">Sổ địa chỉ</a><br />
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
              <h6 class="fw-bold mb-1">Thêm Địa Chỉ Mới</h6>
              <small class="text-muted">* Trường thông tin bắt buộc</small>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitForm" class="mt-4">
          <div class="row g-2 mb-3">
            <div class="col-sm-12 col-md-6">
              <label for="recipientName" class="form-label address-form-label"
                >Họ tên người nhận *</label
              >
              <input
                type="text"
                v-model="form.recipientName"
                class="form-control address-form-input"
                id="recipientName"
              />
            </div>
            <div class="col-sm-12 col-md-6">
              <label for="phoneNumber" class="form-label address-form-label"
                >Số điện thoại *</label
              >
              <input
                type="text"
                v-model="form.phoneNumber"
                class="form-control address-form-input"
                id="phoneNumber"
              />
            </div>
          </div>

          <div class="row g-2 mb-3">
            <div class="col-sm-12 col-md-4">
              <label class="form-label address-form-label">Tỉnh/Thành phố *</label>
              <select
                class="form-select address-form-select"
                v-model="form.provinceId"
                @change="loadDistricts"
              >
                <option value="">Tỉnh/Thành</option>
                <option v-for="p in provinces" :key="p.ProvinceID" :value="p.ProvinceID">
                  {{ p.ProvinceName }}
                </option>
              </select>
            </div>
            <div class="col-sm-12 col-md-4">
              <label class="form-label address-form-label">Quận/Huyện *</label>
              <select
                class="form-select address-form-select"
                v-model="form.districtId"
                @change="loadWards"
              >
                <option value="">Quận/Huyện</option>
                <option v-for="d in districts" :key="d.DistrictID" :value="d.DistrictID">
                  {{ d.DistrictName }}
                </option>
              </select>
            </div>
            <div class="col-sm-12 col-md-4">
              <label class="form-label address-form-label">Phường/Xã *</label>
              <select class="form-select address-form-select" v-model="form.wardCode">
                <option value="">Phường/Xã</option>
                <option v-for="w in wards" :key="w.WardCode" :value="w.WardCode">
                  {{ w.WardName }}
                </option>
              </select>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label address-form-label">Địa chỉ cụ thể *</label>
            <input
              type="text"
              v-model="form.specificAddress"
              class="form-control address-form-input"
            />
          </div>

          <div class="mb-3">
            <label class="form-label address-form-label">Ghi chú (tuỳ chọn)</label>
            <textarea
              v-model="form.note"
              class="form-control address-form-textarea"
              rows="2"
            ></textarea>
          </div>

          <div class="form-check mb-3">
            <input
              class="form-check-input address-form-checkbox"
              type="checkbox"
              v-model="form.defaultAddress"
              id="defaultAddress"
            />
            <label
              class="form-check-label address-form-checkbox-label"
              for="defaultAddress"
            >
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          <button type="submit" class="btn address-form-btn">Lưu địa chỉ</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const ghnToken = "b1128a4b-3c99-11f0-b2d1-fa768adb59a3";

const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const form = ref({
  recipientName: "",
  phoneNumber: "",
  provinceId: "",
  districtId: "",
  wardCode: "",
  specificAddress: "",
  note: "",
  defaultAddress: true,
});

async function loadProvinces() {
  const res = await fetch(
    "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
    {
      headers: { Token: ghnToken },
    }
  );
  const data = await res.json();
  provinces.value = data.data || [];
}

async function loadDistricts() {
  wards.value = [];
  form.value.districtId = "";
  form.value.wardCode = "";
  const res = await fetch(
    "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: ghnToken,
      },
      body: JSON.stringify({ province_id: Number(form.value.provinceId) }),
    }
  );
  const data = await res.json();
  districts.value = data.data || [];
}

async function loadWards() {
  const res = await fetch(
    `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${form.value.districtId}`,
    { headers: { Token: ghnToken } }
  );
  const data = await res.json();
  wards.value = data.data || [];
}

async function submitForm() {
  const Token = localStorage.getItem("token");
  if (!Token) {
    alert("⚠️ Bạn chưa đăng nhập! Token rỗng.");
    return;
  }

  const payload = {
    customerName: form.value.recipientName,
    phone: form.value.phoneNumber,
    address: form.value.specificAddress,
    provinceId: Number(form.value.provinceId),
    provinceName:
      provinces.value.find((p) => p.ProvinceID == form.value.provinceId)?.ProvinceName ||
      "",
    districtId: Number(form.value.districtId),
    districtName:
      districts.value.find((d) => d.DistrictID == form.value.districtId)?.DistrictName ||
      "",
    wardId: Number(form.value.wardCode),
    wardName: wards.value.find((w) => w.WardCode == form.value.wardCode)?.WardName || "",
  };

  try {
    const res = await fetch("http://localhost:8080/api/user/address/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Lỗi khi gửi dữ liệu");

    const data = await res.json();
    alert("✅ Địa chỉ đã được lưu!");
    console.log(data);

    // RESET FORM
    form.value = {
      recipientName: "",
      phoneNumber: "",
      provinceId: "",
      districtId: "",
      wardCode: "",
      specificAddress: "",
      note: "",
      defaultAddress: true,
    };
    districts.value = [];
    wards.value = [];
  } catch (error) {
    console.error("❌ Lỗi gửi form:", error);
    alert("❌ Lỗi lưu địa chỉ.");
  }
}

onMounted(() => {
  loadProvinces();
});
</script>

<style scoped>
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
  border: 1px solid #000;
  transition: 0.3s ease;
}

.address-form-btn:hover {
  background-color: #fff;
  color: #000;
  border: 1px solid #000;
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
</style>
