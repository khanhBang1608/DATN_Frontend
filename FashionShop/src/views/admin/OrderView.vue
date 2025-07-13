<template>
  <div class="container py-5">
    <OrderMain ref="orderMain" @view-order="openOrderModal" @order-updated="refreshOrders" />
    <OrderModal v-if="selectedOrderId" :orderId="selectedOrderId" @close="closeOrderModal" @order-updated="refreshOrders" />
  </div>
</template>

<script setup>
import OrderMain from '@/components/admin/order/OrderMain.vue';
import OrderModal from '@/components/admin/order/OrderModal.vue';
import { ref } from 'vue';

const selectedOrderId = ref(null);
const orderMain = ref(null);

const openOrderModal = (orderId) => {
  console.log('Opening modal for orderId:', orderId);
  selectedOrderId.value = orderId;
};

const closeOrderModal = () => {
  selectedOrderId.value = null;
};

const refreshOrders = async () => {
  if (orderMain.value) {
    await orderMain.value.fetchOrders();
  }
};
</script>
