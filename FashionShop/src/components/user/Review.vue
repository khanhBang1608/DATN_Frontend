<script setup>
import { ref, computed, watch } from "vue";
import { getReviewsByProductId } from "@/api/user/reviewAPI";

const props = defineProps({
  productId: {
    type: [Number, String],
    default: null,
  },
});

const allReviews = ref([]);
const showAllReviews = ref(false); // trạng thái "Xem thêm"
const selectedRatingFilter = ref("all");
const sortOption = ref("newest");

const filteredReviews = computed(() => {
  let result = allReviews.value;

  if (selectedRatingFilter.value !== "all") {
    result = result.filter((r) => r.rating === Number(selectedRatingFilter.value));
  }

  result = [...result].sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));

  return showAllReviews.value ? result : result.slice(0, 4);
});

const reviewCount = computed(() => filteredReviews.value.length);
const totalFiltered = computed(() => {
  if (selectedRatingFilter.value === "all") return allReviews.value.length;
  return allReviews.value.filter((r) => r.rating === Number(selectedRatingFilter.value))
    .length;
});

const averageRating = computed(() => {
  if (!allReviews.value.length) return 0;
  const total = allReviews.value.reduce((sum, r) => sum + r.rating, 0);
  return (total / allReviews.value.length).toFixed(1);
});

async function fetchReviews() {
  try {
    allReviews.value = await getReviewsByProductId(props.productId);
    showAllReviews.value = false;
  } catch (err) {
    console.error("Lỗi khi fetch reviews:", err);
  }
}

watch(
  () => props.productId,
  (newVal) => {
    if (newVal) fetchReviews();
  },
  { immediate: true }
);

const BASE_URL = "http://localhost:8080/images/";

const resolveMediaUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
};
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
</script>

<template>
  <div class="review-section container my-5">
    <h5 class="text-center mb-3">Khách hàng đánh giá ({{ reviewCount }})</h5>

    <div class="d-flex justify-content-end mb-3">
      <select class="form-select w-auto" v-model="sortOption">
        <option value="newest">Mới nhất</option>
        <option value="oldest">Cũ nhất</option>
        <option value="month">Theo tháng</option>
        <option value="year">Theo năm</option>
      </select>
    </div>

    <div class="text-center mb-3">
      <div class="fs-3 text-warning">
        <i
          v-for="n in 5"
          :key="n"
          :class="n <= averageRating ? 'bi bi-star-fill' : 'bi bi-star'"
        ></i>
      </div>
      <div class="fw-semibold mt-2">{{ averageRating }} / 5</div>
    </div>

    <!-- Tabs lọc đánh giá theo số sao -->
    <div class="review-tabs mb-3">
      <select class="form-select d-md-none" v-model="selectedRatingFilter">
        <option value="all">Tất cả ({{ allReviews.length }})</option>
        <option v-for="n in [5, 4, 3, 2, 1]" :key="n" :value="n">
          {{ n }} sao ({{ allReviews.filter((r) => r.rating === n).length }})
        </option>
      </select>
      <ul class="nav nav-tabs justify-content-center d-none d-md-flex">
        <li class="nav-item" v-for="n in ['all', 5, 4, 3, 2, 1]" :key="n">
          <button
            class="nav-link"
            :class="{ active: selectedRatingFilter == n }"
            @click="selectedRatingFilter = n"
          >
            {{ n === "all" ? "Tất cả" : n + " sao" }} ({{
              n === "all"
                ? allReviews.length
                : allReviews.filter((r) => r.rating === Number(n)).length
            }})
          </button>
        </li>
      </ul>
    </div>

    <!-- Nếu không có đánh giá nào -->
    <div v-if="!filteredReviews.length" class="text-center text-muted py-5">
      Chưa có đánh giá
    </div>

    <!-- Danh sách đánh giá -->
    <!-- Danh sách đánh giá -->
    <div v-else>
      <div
        v-for="review in filteredReviews"
        :key="review.reviewId"
        class="mb-4 border-bottom pb-3"
      >
        <strong>{{ review.userFullName }}</strong>
        <span class="text-muted ms-2" style="float: right"
          >{{ formatDate(review.reviewDate) }}
        </span>
        <div class="text-warning">
          <i
            v-for="n in 5"
            :key="n"
            :class="n <= review.rating ? 'bi bi-star-fill' : 'bi bi-star'"
          ></i>
        </div>
        <p class="mb-1">{{ review.comment }}</p>

        <div v-if="review.media?.length" class="d-flex gap-2">
          <div v-for="media in review.media" :key="media.mediaId">
            <img
              v-if="media.reviewType === 'image'"
              :src="resolveMediaUrl(media.reviewUrl)"
              style="width: 80px; height: 80px; object-fit: cover"
            />
            <video
              v-else
              controls
              :src="resolveMediaUrl(media.reviewUrl)"
              style="width: 80px; height: 80px; object-fit: cover"
            ></video>
          </div>
        </div>
      </div>

      <!-- Nút xem thêm nếu có nhiều hơn 4 -->
      <div v-if="totalFiltered > 4" class="text-center mt-3">
        <button class="btn btn-outline-primary" @click="showAllReviews = !showAllReviews">
          {{ showAllReviews ? "Thu gọn" : "Xem thêm đánh giá" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.review-section .bi-star,
.review-section .bi-star-fill {
  margin-right: 4px;
}
</style>
