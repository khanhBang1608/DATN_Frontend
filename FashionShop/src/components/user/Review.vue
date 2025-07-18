<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  createReview,
  getReviewsByProductId,
  getProductIdByOrderDetailId,
  checkUserOrderForProduct
} from '@/api/user/reviewAPI'
const canReview = ref(false);
const props = defineProps({
  productId: {
    type: [Number, String],
    default: null,
  },
  orderDetailId: {
    type: [Number, String],
    default: null,
  },
})

const reviews = ref([])
const selectedRatingFilter = ref('all')
const filterImage = ref(false)
const showReviewModal = ref(false)
const newReview = ref({
  rating: 0,
  comment: '',
  media: [],
})
const isSubmitting = ref(false)
onMounted(async () => {
   if (props.productId) {
    try {
      const check = await checkUserOrderForProduct(props.productId)
      canReview.value = check.canReview
      if (check.canReview) {
        props.orderDetailId = check.orderDetailId
      }
    } catch (err) {
      console.error('Không thể kiểm tra quyền đánh giá:', err)
    }


    fetchReviews() // vẫn gọi fetch review
  } else if (props.orderDetailId) {
    try {
      const result = await getProductIdByOrderDetailId(props.orderDetailId)
      props.productId = result
      fetchReviews()
    } catch (error) {
      console.error('Không thể lấy productId từ orderDetailId:', error)
    }
  } else {
    console.warn('Không có productId hay orderDetailId')
  }
})

async function fetchReviews() {
  try {
    const filters = {
      ratings: selectedRatingFilter.value !== 'all' ? [Number(selectedRatingFilter.value)] : null,
      hasImage: filterImage.value,
    }
    reviews.value = await getReviewsByProductId(props.productId, filters)
  } catch (err) {
    console.error('Lỗi khi fetch reviews:', err)
  }
}

function filterReviews(rating) {
  selectedRatingFilter.value = rating
  fetchReviews()
}

function toggleImageFilter() {
  filterImage.value = !filterImage.value
  fetchReviews()
}

function openReviewModal() {
  showReviewModal.value = true
}

async function submitReview() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    const payload = {
      rating: newReview.value.rating,
      comment: newReview.value.comment,
      orderDetailId: props.orderDetailId,
      media: newReview.value.media,
    }

    await createReview(payload)
    showReviewModal.value = false
    newReview.value = { rating: 0, comment: '', media: [] }
    await fetchReviews()
    alert('Gửi đánh giá thành công!')
  } catch (error) {
    console.error('Gửi đánh giá thất bại:', error)
    alert('Không gửi được đánh giá.')
  } finally {
    isSubmitting.value = false
  }
}

function handleFileUpload(event) {
  const files = event.target.files
  newReview.value.media = Array.from(files).map((file) => ({
    reviewUrl: URL.createObjectURL(file),
    reviewType: file.type.startsWith('image') ? 'image' : 'video',
  }))
}

const reviewCount = computed(() => reviews.value.length)
const averageRating = computed(() => {
  if (!reviews.value.length) return 0
  const total = reviews.value.reduce((sum, r) => sum + r.rating, 0)
  return (total / reviews.value.length).toFixed(1)
})
</script>

<template>
  <div class="review-section container my-5">
    <h5 class="text-center mb-3">Khách hàng đánh giá ({{ reviewCount }})</h5>

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

    <div class="review-tabs mb-3">
      <select
        class="form-select d-md-none"
        v-model="selectedRatingFilter"
        @change="filterReviews($event.target.value)"
      >
        <option value="all">Tất cả ({{ reviewCount }})</option>
        <option v-for="n in [5, 4, 3, 2, 1]" :key="n" :value="n">
          {{ n }} sao ({{ reviews.filter((r) => r.rating === n).length }})
        </option>
      </select>
      <ul class="nav nav-tabs justify-content-center d-none d-md-flex">
        <li class="nav-item" v-for="n in ['all', 5, 4, 3, 2, 1]" :key="n">
          <button
            class="nav-link"
            :class="{ active: selectedRatingFilter == n }"
            @click="filterReviews(n)"
          >
            {{ n === 'all' ? 'Tất cả' : n + ' sao' }} ({{
              n === 'all' ? reviewCount : reviews.filter((r) => r.rating === Number(n)).length
            }})
          </button>
        </li>
      </ul>
    </div>

    <div class="d-flex justify-content-between mb-3">
      <div>
        <input type="checkbox" v-model="filterImage" @change="toggleImageFilter" />
        <label>Chỉ hiển thị có hình ảnh</label>
      </div>
      <button v-if="canReview" class="btn btn-outline-dark btn-sm" @click="openReviewModal">
        Viết đánh giá
      </button>
    </div>

    <div v-if="!reviews.length" class="text-center text-muted py-5">Chưa có đánh giá</div>

    <div v-else>
      <div v-for="review in reviews" :key="review.reviewId" class="mb-4 border-bottom pb-3">
        <strong>{{ review.userFullName }}</strong>
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
              :src="media.reviewUrl"
              style="width: 80px; height: 80px; object-fit: cover"
            />
            <video
              v-else
              controls
              :src="media.reviewUrl"
              style="width: 80px; height: 80px; object-fit: cover"
            ></video>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showReviewModal"
      class="modal fade show d-block"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">Viết đánh giá</h5></div>
          <div class="modal-body">
            <div class="mb-3">
              <label>Đánh giá sao</label>
              <div class="text-warning">
                <i
                  v-for="n in 5"
                  :key="n"
                  :class="n <= newReview.rating ? 'bi bi-star-fill' : 'bi bi-star'"
                  @click="newReview.rating = n"
                  style="cursor: pointer"
                ></i>
              </div>
            </div>
            <div class="mb-3">
              <label>Nhận xét</label>
              <textarea v-model="newReview.comment" class="form-control" rows="3"></textarea>
            </div>
            <div class="mb-3">
              <label>Ảnh/Video</label>
              <input
                type="file"
                class="form-control"
                multiple
                accept="image/*,video/*"
                @change="handleFileUpload"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showReviewModal = false">Hủy</button>
            <button
              class="btn btn-primary"
              :disabled="!newReview.rating || isSubmitting"
              @click="submitReview"
            >
              Gửi
            </button>
          </div>
        </div>
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
