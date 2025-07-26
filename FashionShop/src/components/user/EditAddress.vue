<template>
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
        <h3 class="text-center fw-bold mb-4">Chỉnh Sửa Địa Chỉ</h3>
        <form @submit.prevent="submitForm">
          <div class="row g-2 mb-3">
            <div class="col-md-6">
              <label class="form-label">Họ tên người nhận *</label>
              <input type="text" class="form-control" v-model="form.customerName" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Số điện thoại *</label>
              <input type="text" class="form-control" v-model="form.phone" required />
            </div>
          </div>

          <div class="row g-2 mb-3">
            <div class="col-md-4">
              <label class="form-label">Tỉnh/Thành phố *</label>
              <select class="form-select" v-model="form.provinceId" @change="loadDistricts" required>
                <option value="">Chọn tỉnh/thành</option>
                <option v-for="p in provinces" :key="p.ProvinceID" :value="p.ProvinceID">
                  {{ p.ProvinceName }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Quận/Huyện *</label>
              <select class="form-select" v-model="form.districtId" @change="loadWards" :disabled="!form.provinceId" required>
                <option value="">Chọn quận/huyện</option>
                <option v-for="d in districts" :key="d.DistrictID" :value="d.DistrictID">
                  {{ d.DistrictName }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Phường/Xã *</label>
              <select class="form-select" v-model="form.wardId" :disabled="!form.districtId" required>
                <option value="">Chọn phường/xã</option>
                <option v-for="w in wards" :key="w.WardCode" :value="w.WardCode">
                  {{ w.WardName }}
                </option>
              </select>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Địa chỉ cụ thể *</label>
            <input type="text" class="form-control" v-model="form.address" required />
          </div>
          <button type="submit" class="btn btn-dark">Cập nhật địa chỉ</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const ghnToken = "b1128a4b-3c99-11f0-b2d1-fa768adb59a3";

console.log("Token:", localStorage.getItem("token"));

const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);

const form = ref({
  addressId: null,
  customerName: "",
  phone: "",
  provinceId: "",
  districtId: "",
  wardId: "",
  address: "",
  defaultAddress: false
});

const loadProvinces = async () => {
  const res = await fetch("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
    headers: { Token: ghnToken },
  });
  const data = await res.json();
  provinces.value = data.data || [];
};

const loadDistricts = async () => {
  if (!form.value.provinceId) return;
  form.value.districtId = "";
  form.value.wardId = "";
  wards.value = [];

  const res = await fetch("https://online-gateway.ghn.vn/shiip/public-api/master-data/district", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Token: ghnToken,
    },
    body: JSON.stringify({ province_id: Number(form.value.provinceId) }),
  });
  const data = await res.json();
  districts.value = data.data || [];
};

const loadWards = async () => {
  if (!form.value.districtId) return;

  const res = await fetch(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${form.value.districtId}`, {
    headers: { Token: ghnToken },
  });
  const data = await res.json();
  wards.value = data.data || [];
};

const submitForm = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");

    const res = await fetch(`http://localhost:8080/api/user/address/update/${form.value.addressId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form.value),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Lỗi cập nhật: ${errText}`);
    }

    alert("Cập nhật địa chỉ thành công!");
    router.push("/user/listaddress");
  } catch (err) {
    console.error("❌ Lỗi cập nhật:", err);
    alert(err.message || "Có lỗi xảy ra.");
  }
};

onMounted(async () => {
  await loadProvinces();

  const editData = localStorage.getItem("editAddress");
  if (!editData) {
    alert("Không tìm thấy dữ liệu địa chỉ cần sửa!");
    router.push("/user/listaddress");
    return;
  }

  try {
    const addr = JSON.parse(editData);
    form.value = {
      addressId: addr.addressId,
      customerName: addr.customerName,
      phone: addr.phone,
      provinceId: addr.provinceId,
      districtId: addr.districtId,
      wardId: addr.wardId,
      address: addr.address,
      defaultAddress: addr.defaultAddress || false,
    };

    await loadDistricts();
    await loadWards();
  } catch (err) {
    console.error("❌ Lỗi parse editAddress:", err);
    alert("Dữ liệu không hợp lệ.");
    router.push("/user/listaddress");
  }
});
</script>
