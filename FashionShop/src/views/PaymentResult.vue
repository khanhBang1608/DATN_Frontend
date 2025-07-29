<script setup>
import { useRoute, useRouter } from 'vue-router';
import { createOrder } from "@/api/user/orderAPI";
import { clearCart } from "@/api/user/cartAPI";
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const status = route.query.status;

if (status === "success") {
  const orderData = JSON.parse(localStorage.getItem("pendingOrder"));
  if (orderData) {
    createOrder(orderData)
      .then(async (res) => {
        await clearCart();
        localStorage.removeItem("pendingOrder");
        toast.success("Thanh toán & đặt hàng thành công!");
        router.push("/user/order-management");
      })
      .catch(() => {
        toast.error("Tạo đơn hàng thất bại sau khi thanh toán.");
      });
  } else {
    toast.error("Không tìm thấy đơn hàng để xác nhận.");
    router.push("/");
  }
} else {
  toast.error("Thanh toán thất bại hoặc bị hủy.");
  router.push("/user/cart");
}
</script>
