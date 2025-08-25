<script setup>
import { useRoute, useRouter } from "vue-router";
import { createOrder } from "@/api/user/orderAPI";
import { clearCart } from "@/api/user/cartAPI";
import iziToast from "izitoast"; // ✅ import iziToast
import "izitoast/dist/css/iziToast.min.css"; // ✅ import CSS

const route = useRoute();
const router = useRouter();

const vnpStatus = route.query.vnp_TransactionStatus;

if (vnpStatus === "00") {
  const orderData = JSON.parse(localStorage.getItem("pendingOrder"));
  if (orderData) {
    createOrder(orderData)
      .then(async () => {
        await clearCart();
        localStorage.removeItem("pendingOrder");
        iziToast.success({
          title: "Thành công",
          message: "Thanh toán & đặt hàng thành công!",
          position: "topRight",
        });
        router.push("/user/order-management");
      })
      .catch(() => {
        iziToast.error({
          title: "Lỗi",
          message: "Tạo đơn hàng thất bại sau khi thanh toán.",
          position: "topRight",
        });
      });
  } else {
    iziToast.error({
      title: "Lỗi",
      message: "Không tìm thấy đơn hàng để xác nhận.",
      position: "topRight",
    });
    router.push("/");
  }
} else {
  iziToast.error({
    title: "Thanh toán thất bại",
    message: "Thanh toán thất bại hoặc bị hủy.",
    position: "topRight",
  });
  setTimeout(() => {
    router.push("/user/cart");
  }, 2000);
}
</script>
