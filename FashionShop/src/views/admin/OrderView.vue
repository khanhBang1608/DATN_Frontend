<template>
  <div class="container py-5">
    <OrderMain ref="orderMain" @view-order="openOrderModal" @order-updated="refreshOrders" />
  </div>
</template>

<script setup>
import OrderMain from '@/components/admin/order/OrderMain.vue';
import { ref } from 'vue';

const orderMain = ref(null);

</script>
