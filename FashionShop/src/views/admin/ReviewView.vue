<template>
  <div class="container py-5">
    <ReviewMain ref="reviewMain" @view-review="openReviewModal" @review-updated="refreshReviews" />
    <ReviewModal v-if="selectedReviewId" :reviewId="selectedReviewId" @close="closeReviewModal" @review-updated="refreshReviews" />
  </div>
</template>

<script setup>
import ReviewMain from '@/components/admin/review/ReviewMain.vue';
import ReviewModal from '@/components/admin/review/ReviewModal.vue';
import { ref} from 'vue';

const selectedReviewId = ref(null);
const reviewMain = ref(null);

const openReviewModal = (reviewId) => {
  console.log('Opening modal for reviewId:', reviewId);
  selectedReviewId.value = reviewId;
};

const closeReviewModal = () => {
  selectedReviewId.value = null;
};

const refreshReviews = async () => {
  if (reviewMain.value) {
    await reviewMain.value.fetchReviews();
  }
};
</script>
