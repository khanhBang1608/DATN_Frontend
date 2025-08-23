<script>
import axios from "axios";
import { createOrder } from "@/api/user/orderAPI";
import { removeCartItem } from "@/api/user/cartAPI";
import { getDiscount } from "@/api/user/discountAPI";
import { getShippingFee } from "@/api/user/ShippingFeeAPI";
import { v4 as uuidv4 } from "uuid";
import iziToast from "izitoast";

export default {
  data() {
    return {
      // Địa chỉ
      provinces: [],
      districts: [],
      wards: [],
      addressList: [],
      selectedAddressId: "",

      errors: {
        fullName: "",
        phone: "",
        address: "",
      },

      // Thông tin form
      form: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        country: "Vietnam",
        city: "",
        district: "",
        ward: "",
        province: "",
      },

      // Giỏ hàng và đơn hàng
      cartDetails: [],
      paymentMethod: "COD",
      shippingFee: null,
      loading: false,
      isMobileOrderVisible: false,

      // Giảm giá
      discountList: [],
      selectedDiscount: null,
      discountCode: "",
      discountAmount: 0,
      discountError: "",

      showAllDiscounts: false,
      displayCount: 4,
    };
  },

  computed: {
    displayedDiscounts() {
      // Hiển thị 4 mã hoặc tất cả tùy thuộc vào showAllDiscounts
      return this.showAllDiscounts
        ? this.validDiscounts
        : this.validDiscounts.slice(0, this.displayCount);
    },
    defaultAddress() {
      return this.addressList.find((a) => a.isDefault) || this.addressList[0];
    },
    subtotal() {
      return this.cartDetails.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    total() {
      return this.subtotal + this.shippingFee - this.discountAmount;
    },
    toggleIcon() {
      return this.isMobileOrderVisible ? "bi-chevron-up" : "bi-chevron-down";
    },
    validDiscounts() {
      return this.discountList
        .filter((d) => d.quantityLimit !== 0 && this.subtotal >= (d.minOrderAmount || 0))
        .sort((a, b) => (b.maxDiscountAmount || 0) - (a.maxDiscountAmount || 0)); // Sắp xếp theo maxDiscountAmount từ cao đến thấp
    },
  },

  watch: {
    "form.province"(provinceName) {
      const selectedProvince = this.provinces.find((p) => p.name === provinceName);
      if (selectedProvince) {
        axios
          .get(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
          .then((res) => {
            this.districts = res.data.districts;
            this.form.district = "";
            this.wards = [];
            this.form.ward = "";
          });
      }
    },
    "form.district"(districtName) {
      const selectedDistrict = this.districts.find((d) => d.name === districtName);
      if (selectedDistrict) {
        axios
          .get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
          .then((res) => {
            this.wards = res.data.wards;
            this.form.ward = "";
          });
      }
    },
  },

  methods: {
    toggleShowDiscounts() {
      if (!this.showAllDiscounts) {
        // Nếu chưa hiển thị hết, tăng số lượng hiển thị
        this.displayCount += 4;
        // Kiểm tra nếu đã hiển thị hết mã
        if (this.displayCount >= this.validDiscounts.length) {
          this.showAllDiscounts = true;
          this.displayCount = this.validDiscounts.length;
        }
      } else {
        // Nếu đang hiển thị hết, thu gọn lại
        this.showAllDiscounts = false;
        this.displayCount = 4;
      }
    },
    goToNewAddress() {
      // Đóng modal trước
      const modal = bootstrap.Modal.getInstance(document.getElementById("addressModal"));
      if (modal) modal.hide();

      // Điều hướng sang trang thêm địa chỉ
      this.$router.push({ path: "/user/address", query: { redirect: "checkout" } });
    },
    openAddressModal() {
      const modal = new bootstrap.Modal(document.getElementById("addressModal"));
      modal.show();
    },
    confirmAddress() {
      this.onSelectAddress();
      const modal = bootstrap.Modal.getInstance(document.getElementById("addressModal"));
      if (modal) modal.hide();
    },
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    },

    toggleOrderCollapse() {
      this.isMobileOrderVisible = !this.isMobileOrderVisible;
    },

    applyDiscount(discount) {
      this.discountAmount = 0;
      this.discountCode = "";
      this.discountError = "";
      this.selectedDiscount = discount;

      if (!discount) return;

      // Kiểm tra số tiền tối thiểu, nếu không đủ thì ẩn mã giảm giá
      if (this.subtotal < (discount.minOrderAmount || 0)) {
        this.selectedDiscount = null; // Ẩn mã giảm giá
        return;
      }

      const percentDiscount = (this.subtotal * discount.discountPercent) / 100;
      const maxDiscount = discount.maxDiscountAmount || percentDiscount;
      this.discountAmount = Math.min(percentDiscount, maxDiscount);
      this.discountCode = discount.discountCode;

      //  iziToast.success({
      //   title: 'Thành công',
      //   message: `Áp dụng mã ${this.discountCode} thành công!`,
      //   position: 'topRight'
      // });
    },

    async calculateShippingFee() {
      if (!this.selectedAddressId || this.cartDetails.length === 0) return;

      // Tạm tính khối lượng đơn hàng
      const weight =
        this.cartDetails.reduce(
          (total, item) => total + item.weight * item.quantity,
          0
        ) || 500;

      // Các kích thước mặc định (nên lấy từ DB sản phẩm nếu có)
      const length = 20;
      const width = 15;
      const height = 10;

      try {
        // Gọi API backend để tính phí ship
        const response = await getShippingFee({
          addressId: Number(this.selectedAddressId),
          weight,
          length,
          width,
          height,
          insuranceValue: this.subtotal,
        });

        console.log("Phản hồi từ API phí vận chuyển:", response);

        if (response && response.data && typeof response.data.total === "number") {
          this.shippingFee = response.data.total;
        } else {
          console.warn("Không tìm thấy 'total' trong phản hồi. Dùng mặc định 10000");
          this.shippingFee = 10000;
        }
      } catch (err) {
        console.error("Không thể tính phí vận chuyển:");

        // Ghi chi tiết nếu là lỗi từ response GHN
        if (err.response && err.response.data) {
          console.error("Mã lỗi:", err.response.data.code);
          console.error("Thông báo:", err.response.data.message);
          console.error("Chi tiết:", err.response.data.data);
        } else {
          console.error(err);
        }

        // Dùng mặc định khi lỗi
        this.shippingFee = 80000;
      }

      // Log thông tin gửi đi để tiện debug
      console.log("📦 Gọi tính phí với:", {
        addressId: this.selectedAddressId,
        weight,
        insuranceValue: this.subtotal,
        dimensions: { length, width, height },
      });
    },
    async placeOrder() {
      this.errors = { fullName: "", phone: "", address: "" };
      if (!this.selectedAddressId) {
        iziToast.error({
          title: "Lỗi",
          message: "Vui lòng chọn địa chỉ giao hàng trước khi đặt hàng.",
          position: "topRight",
        });
        return;
      }

      const namePattern = /^[a-zA-ZÀ-ỹ\s]{2,50}$/;
      if (!this.form.fullName.trim()) {
        this.errors.fullName = "Vui lòng nhập tên người nhận.";
      } else if (!namePattern.test(this.form.fullName.trim())) {
        this.errors.fullName = "Tên chỉ được chứa chữ, tối thiểu 2 ký tự.";
      }

      const phonePattern = /^(0[3|5|7|8|9][0-9]{8}|(\+84)[3|5|7|8|9][0-9]{8})$/;
      if (!this.form.phone.trim()) {
        this.errors.phone = "Vui lòng nhập số điện thoại.";
      } else if (!phonePattern.test(this.form.phone.trim())) {
        this.errors.phone = "Số điện thoại không đúng định dạng.";
      }

      if (!this.form.address.trim()) {
        this.errors.address = "Vui lòng nhập địa chỉ.";
      }

      if (this.errors.fullName || this.errors.phone || this.errors.address) {
        return;
      }

      if (this.loading) return;
      this.loading = true;
      const idempotencyKey = uuidv4();

      try {
        const fullAddress = `${this.form.phone} - ${this.form.fullName} - ${this.form.address}, ${this.form.ward}, ${this.form.district}, ${this.form.province}, ${this.form.country}`;
        const orderDetails = this.cartDetails.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          price: item.discountedPrice || item.price,
        }));

        if (this.paymentMethod === "COD") {
          const orderData = {
            address: fullAddress,
            paymentMethod: this.paymentMethod,
            discountCode: this.discountCode || null,
            discountAmount: this.discountAmount || 0,
            shippingFee: this.shippingFee,
            orderDetails,
            idempotencyKey,
          };
          const response = await createOrder(orderData);
          for (const item of this.cartDetails) {
            await removeCartItem(item.cartDetailId);
          }
          iziToast.success({
            title: "Thành công",
            message: `Đặt hàng thành công! Mã đơn hàng: #${response.orderId}`,
            position: "topRight",
          });
          this.$router.push("/user/order-management");
        } else if (this.paymentMethod === "VNPAY") {
          const requestData = {
            total: this.total,
            address: fullAddress,
            discountCode: this.discountCode || null,
            discountAmount: this.discountAmount || 0,
            shippingFee: this.shippingFee,
            orderDetails,
            idempotencyKey,
          };
          const res = await axios.post("/api/user/payment/create", requestData, {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") },
          });
          localStorage.setItem(
            "pendingOrder",
            JSON.stringify({
              address: fullAddress,
              email: this.form.email || "default@example.com",
              paymentMethod: this.paymentMethod,
              paymentStatus: 1,
              discountCode: this.discountCode || null,
              discountAmount: this.discountAmount || 0,
              shippingFee: this.shippingFee,
              orderDetails,
              idempotencyKey,
            })
          );
          window.location.href = res.data.paymentUrl;
        }
      } catch (error) {
        console.error("Lỗi khi đặt hàng:", error);
        iziToast.error({
          title: "Lỗi",
          message: "Có lỗi xảy ra khi đặt hàng.",
          position: "topRight",
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchAddresses() {
      try {
        const res = await axios.get("/api/user/address/list", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        this.addressList = res.data;

        if (this.addressList.length === 0) {
          iziToast.warning({
            title: "Cảnh báo",
            message: "Bạn chưa có địa chỉ giao hàng. Vui lòng thêm địa chỉ trước.",
            position: "topRight",
          });
          this.$router.push("/user/address");
        }
      } catch (err) {
        console.error("Lỗi khi lấy địa chỉ:", err);
      }
    },

    onSelectAddress() {
      const selected = this.addressList.find(
        (a) => a.addressId === this.selectedAddressId
      );
      if (!selected) return;

      // Điền dữ liệu vào form
      this.form.fullName = selected.customerName;
      this.form.phone = selected.phone;
      this.form.address = selected.address;
      this.form.province = selected.provinceName;
      this.form.district = selected.districtName;
      this.form.ward = selected.wardName;

      // Tính lại phí vận chuyển
      this.calculateShippingFee();
    },
  },
  mounted() {
    axios.get("https://provinces.open-api.vn/api/p/").then((res) => {
      this.provinces = res.data;
    });

    getDiscount()
      .then((res) => {
        this.discountList = res;
      })
      .catch(() => {
        this.discountError = "Không thể tải mã giảm giá.";
      });

    if (!localStorage.getItem("token")) {
      iziToast.error({
        title: "Lỗi",
        message: "Vui lòng đăng nhập để tiếp tục.",
        position: "topRight",
      });
      this.$router.push("/login");
    } else {
      const cartDetails = localStorage.getItem("cartDetails");
      if (cartDetails) {
        this.cartDetails = JSON.parse(cartDetails);
        this.calculateShippingFee();
      } else {
        iziToast.error({
          title: "Lỗi",
          message: "Không tìm thấy thông tin giỏ hàng.",
          position: "topRight",
        });
        this.$router.push("/user/cart");
      }
    }

    this.fetchAddresses().then(() => {
      if (this.addressList.length === 1) {
        // Nếu chỉ có 1 địa chỉ, tự động chọn
        this.selectedAddressId = this.addressList[0].addressId;
        this.onSelectAddress();
      } else if (this.addressList.length > 1) {
        // Nếu nhiều địa chỉ, mở modal để chọn ngay
        this.openAddressModal();
      }
    });
  },
};
</script>

<template>
  <div class="checkout-container container">
    <div class="row g-0">
      <div class="col-md-5 bg-light px-4 py-3 d-md-none">
        <div class="checkout-sidebar">
          <div
            class="checkout-toggle mb-3 d-flex justify-content-between align-items-center"
            @click="toggleOrderCollapse"
          >
            <button
              class="btn btn-link w-100 p-0 text-decoration-none text-dark d-flex justify-content-between align-items-center"
            >
              <span><i class="bi bi-cart"></i> Hiển thị thông tin đơn hàng</span>
              <i :class="toggleIcon"></i>
            </button>
          </div>

          <!-- Mã giảm giá - Thiết kế mới như ảnh: các badge clickable -->
          <div class="mb-3">
            <label class="form-label fw-bold">Mã giảm giá:</label>
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="d in displayedDiscounts"
                :key="d.discountId"
                class="badge rounded-pill px-3 py-2 cursor-pointer"
                :class="{
                  'bg-primary text-white':
                    selectedDiscount && selectedDiscount.discountId === d.discountId,
                  'bg-light text-dark border': !(
                    selectedDiscount && selectedDiscount.discountId === d.discountId
                  ),
                }"
                @click="applyDiscount(d)"
                style="
                  transition: all 0.3s ease;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                "
              >
                {{ d.discountCode }} - {{ d.discountPercent }}% (tối đa
                {{ formatPrice(d.maxDiscountAmount || 0) }})
              </span>
            </div>
            <div v-if="validDiscounts.length > 4" class="mt-2">
              <span
                class="text-primary choose-address"
                role="button"
                @click="toggleShowDiscounts"
              >
                {{ showAllDiscounts ? "Thu gọn" : "Xem thêm" }}
              </span>
            </div>
            <div v-if="discountError" class="text-danger mt-2">{{ discountError }}</div>
          </div>

          <!-- Collapse đơn hàng -->
          <div
            id="orderCollapse"
            class="collapse checkout-summary rounded"
            :class="{ show: isMobileOrderVisible }"
          >
            <div
              v-for="item in cartDetails"
              :key="item.cartDetailId"
              class="checkout-product d-flex align-items-center mb-3"
            >
              <img
                :src="`http://localhost:8080/images/${item.imageUrl}`"
                :alt="item.productName"
                width="40"
                height="40"
                class="me-3 rounded"
              />
              <div class="flex-grow-1">
                <p class="mb-0 fw-bold">{{ item.productName }}</p>
                <small
                  >Size: {{ item.size }} | Màu: {{ item.color }} | Số lượng:
                  {{ item.quantity }}</small
                >
              </div>
              <div class="ms-auto fw-bold">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>

            <div class="checkout-subtotal d-flex justify-content-between mb-2">
              <span>Tạm tính</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="checkout-shipping-fee d-flex justify-content-between mb-2">
              <span>Phí vận chuyển</span>
              <span>
                <template v-if="selectedAddressId">
                  {{ formatPrice(shippingFee) }}
                </template>
                <template v-else>
                  <span class="text-muted">Chưa chọn địa chỉ</span>
                </template>
              </span>
            </div>

            <div
              class="checkout-discount-amount d-flex justify-content-between mb-2"
              v-if="discountAmount > 0"
            >
              <span>Giảm giá</span>
              <span>-{{ formatPrice(discountAmount) }}</span>
            </div>
            <hr />
            <div class="checkout-total d-flex justify-content-between fw-bold fs-5">
              <span>Tổng cộng</span>
              <span>{{ formatPrice(total) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Form thông tin giao hàng -->
      <div class="col-md-7 border-end bg-white px-4 py-3">
        <div class="checkout-form-container">
          <div class="checkout-logo mb-4 ms-4">
            <img
              src="@/assets/img/logo-brand.png"
              alt="L'hex Logo"
              style="height: 62px"
            />
          </div>
          <nav class="checkout-breadcrumb mb-3">
            <router-link to="/user/cart" class="text-muted text-decoration-none"
              >Giỏ hàng</router-link
            >
            >
            <span class="text-muted">Thông tin giao hàng</span>
          </nav>

          <div class="checkout-header">
            <h2>Thông tin giao hàng</h2>
          </div>

          <form class="checkout-form" @submit.prevent="placeOrder">
            <div class="mb-3">
              <label class="form-label fw-semibold d-block">Địa Chỉ Nhận Hàng</label>

              <!-- Hiển thị khi chưa chọn -->
              <div
                v-if="!selectedAddressId"
                class="alert alert-warning py-2 d-flex justify-content-between align-items-center"
              >
                <span>Bạn chưa chọn địa chỉ giao hàng.</span>
                <span
                  class="text-primary choose-address"
                  role="button"
                  @click="openAddressModal"
                >
                  Chọn ngay
                </span>
              </div>

              <!-- Hiển thị sau khi chọn -->
              <div
                v-else
                class="border rounded p-2 bg-light d-flex justify-content-between align-items-start"
              >
                <div class="d-flex justify-content-between align-items-center w-100">
                  <div>
                    <strong>{{ form.fullName }}</strong>
                    <strong class="ms-2">{{ form.phone }}</strong>
                    <div>
                      {{
                        [form.address, form.ward, form.district, form.province]
                          .filter(Boolean)
                          .join(", ")
                      }}
                    </div>
                  </div>
                  <div>
                    <span
                      class="text-primary choose-address"
                      role="button"
                      @click="openAddressModal"
                    >
                      Thay đổi
                    </span>
                  </div>
                </div>
              </div>

              <!-- Modal chọn địa chỉ -->
              <div
                class="modal fade"
                id="addressModal"
                tabindex="-1"
                aria-labelledby="addressModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content border-0 shadow">
                    <!-- Header -->
                    <div class="modal-header border-bottom">
                      <h5
                        class="modal-title fw-semibold text-dark"
                        id="addressModalLabel"
                      >
                        Địa Chỉ Của Tôi
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                      ></button>
                    </div>

                    <!-- Body -->
                    <div class="modal-body">
                      <!-- Danh sách địa chỉ -->
                      <div
                        v-for="address in addressList"
                        :key="address.addressId"
                        class="border-bottom py-3 d-flex align-items-start"
                      >
                        <!-- Radio + Thông tin -->
                        <div class="flex-grow-1">
                          <div class="d-flex align-items-center mb-1">
                            <input
                              type="radio"
                              :value="address.addressId"
                              v-model="selectedAddressId"
                              class="form-check-input me-2"
                            />
                            <strong class="me-2 text-dark">{{
                              address.customerName
                            }}</strong>
                            <span class="text-muted">{{ address.phone }}</span>
                          </div>
                          <div class="text-secondary small">
                            {{ address.fullAddress || address.address }}
                          </div>
                        </div>
                      </div>

                      <!-- Thêm địa chỉ mới -->
                      <div class="mt-3 d-flex justify-content-start">
                        <button class="btn btn-outline-secondary" @click="goToNewAddress">
                          Thêm Địa Chỉ Mới
                        </button>
                      </div>
                    </div>

                    <!-- Footer -->
                    <div class="modal-footer border-top">
                      <button type="button" class="btn btn-light" data-bs-dismiss="modal">
                        Hủy
                      </button>
                      <button
                        type="button"
                        class="btn btn-dark"
                        @click="confirmAddress"
                        data-bs-dismiss="modal"
                      >
                        Xác nhận
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Input tên, SĐT, địa chỉ -->
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Họ tên người nhận</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Nhập họ và tên..."
                  v-model="form.fullName"
                />
                <div v-if="errors.fullName" class="text-danger small mt-1">
                  {{ errors.fullName }}
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Số điện thoại</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Nhập số điện thoại..."
                  v-model="form.phone"
                />
                <div v-if="errors.phone" class="text-danger small mt-1">
                  {{ errors.phone }}
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Địa chỉ chi tiết</label>
              <input
                type="text"
                class="form-control"
                placeholder="Nhập địa chỉ chi tiết..."
                v-model="form.address"
              />
              <div v-if="errors.address" class="text-danger small mt-1">
                {{ errors.address }}
              </div>
            </div>

            <!-- Phương thức vận chuyển -->
            <div class="checkout-section-title">Phương thức vận chuyển</div>
            <div class="checkout-shipping-method mb-4 text-center">
              <i class="bi bi-box" style="font-size: 32px"></i>
              <p class="mt-2">Phí vận chuyển: {{ formatPrice(shippingFee) }}</p>
            </div>

            <!-- Phương thức thanh toán -->
            <div class="checkout-section-title">Phương thức thanh toán</div>
            <div class="checkout-payment-methods my-4">
              <div class="list-group">
                <label class="list-group-item d-flex align-items-center gap-3">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="COD"
                    v-model="paymentMethod"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/484/484167.png"
                    alt="COD"
                    width="24"
                  />
                  <span>Thanh toán khi giao hàng (COD)</span>
                </label>
                <label class="list-group-item d-flex align-items-center gap-3">
                  <input
                    class="form-check-input"
                    type="radio"
                    value="VNPAY"
                    v-model="paymentMethod"
                  />
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s"
                    alt="VNPAY"
                    width="24"
                  />
                  <span>Ví VNPAY</span>
                </label>
              </div>
            </div>

            <!-- Nút hoàn tất -->
            <div
              class="checkout-actions d-flex justify-content-between align-items-center gap-3"
            >
              <router-link to="/user/cart" class="link-cart text-center"
                >Giỏ hàng</router-link
              >
              <button type="submit" class="btn btn-complete" :disabled="loading">
                {{ loading ? "Đang xử lý..." : "Hoàn tất đơn hàng" }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Thông tin đơn hàng desktop -->
      <div class="col-md-5 bg-light px-4 py-3">
        <div class="checkout-sidebar">
          <div class="checkout-summary d-none d-md-block mt-5 p-4 rounded">
            <div
              v-for="item in cartDetails"
              :key="item.cartDetailId"
              class="checkout-product d-flex align-items-center mb-3"
            >
              <img
                :src="`http://localhost:8080/images/${item.imageUrl}`"
                :alt="item.productName"
                width="80"
                height="90"
                class="me-3 rounded"
              />
              <div class="flex-grow-1">
                <p class="mb-0 fw-bold">{{ item.productName }}</p>
                <small
                  >Size: {{ item.size }} | Màu: {{ item.color }} | Số lượng:
                  {{ item.quantity }}</small
                >
              </div>
              <div class="ms-auto fw-bold">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>

            <!-- Mã giảm giá - Thiết kế mới cho desktop -->
            <div class="mb-3">
              <label class="form-label fw-bold">Mã giảm giá:</label>
              <div class="d-flex flex-wrap gap-3">
                <div
                  v-for="d in displayedDiscounts"
                  :key="d.discountId"
                  class="discount-card p-1 cursor-pointer"
                  :class="{
                    selected:
                      selectedDiscount && selectedDiscount.discountId === d.discountId,
                  }"
                  @click="applyDiscount(d)"
                >
                  <div
                    class="d-flex align-items-center justify-content-center text-center gap-2"
                  >
                    <i class="fas fa-ticket-alt text-primary"></i>
                    <span class="fw-bold">{{ d.discountCode }}</span>
                  </div>
                  <div class="text-muted small">
                    Giảm
                    <strong class="text-danger">{{ d.discountPercent }}%</strong> (Tối đa
                    <strong>{{ formatPrice(d.maxDiscountAmount || 0) }}</strong
                    >)
                  </div>
                </div>
              </div>
              <div v-if="validDiscounts.length > 4" class="mt-2">
                <span
                  class="text-primary choose-address"
                  role="button"
                  @click="toggleShowDiscounts"
                >
                  {{ showAllDiscounts ? "Thu gọn" : "Xem thêm mã giảm giá" }}
                </span>
              </div>
              <div v-if="discountError" class="text-danger mt-1">{{ discountError }}</div>
            </div>

            <div class="checkout-subtotal d-flex justify-content-between mb-2">
              <span>Tạm tính</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div
              class="checkout-shipping-method mb-4 d-flex align-items-center justify-content-between px-3 py-2 bg-white border rounded shadow-sm"
            >
              <div class="d-flex align-items-center">
                <i class="bi bi-truck fs-4 text-primary me-3"></i>
                <div>
                  <strong>Phí vận chuyển</strong>
                  <p class="mb-0 small text-muted">
                    Tự động tính theo địa chỉ và trọng lượng
                  </p>
                </div>
              </div>
              <div class="text-end fw-bold">{{ formatPrice(shippingFee) }}</div>
            </div>

            <div
              class="checkout-discount-amount d-flex justify-content-between mb-2"
              v-if="discountAmount > 0"
            >
              <span>Giảm giá</span>
              <span>-{{ formatPrice(discountAmount) }}</span>
            </div>
            <hr />
            <div class="checkout-total d-flex justify-content-between fw-bold fs-5">
              <span>Tổng cộng</span>
              <span>{{ formatPrice(total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/css/checkout.css"></style>
<style>
.cursor-pointer {
  cursor: pointer;
}
.badge:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
