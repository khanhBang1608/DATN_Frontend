<template>
  <div class="modal fade" :id="'reviewModal' + reviewId" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div v-if="review" class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">📝 Chi tiết đánh giá #{{ review.reviewId }}</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body row g-3">
          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
            <button @click="error = null" class="btn btn-sm btn-outline-danger">
              Đóng
            </button>
          </div>
          <div class="col-md-6">
            <label class="form-label">Mã đánh giá</label>
            <input type="text" class="form-control" :value="review.reviewId" disabled />
          </div>
          <div class="col-md-6">
            <label class="form-label">Người đánh giá</label>
            <input
              type="text"
              class="form-control"
              :value="review.userFullName || 'Không xác định'"
              disabled
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">Sản phẩm</label>
            <input
              type="text"
              class="form-control"
              :value="review.productName || 'Không xác định'"
              disabled
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">Đánh giá</label>
            <input
              type="text"
              class="form-control"
              :value="review.rating + ' sao'"
              disabled
            />
          </div>
          <div class="col-12">
            <label class="form-label">Bình luận</label>
            <textarea
              class="form-control"
              :value="review.comment"
              rows="4"
              disabled
            ></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label">Ngày đánh giá</label>
            <input
              type="text"
              class="form-control"
              :value="formatDate(review.reviewDate)"
              disabled
            />
          </div>
          <div class="col-12" v-if="review.media && review.media.length > 0">
            <label class="form-label">Media</label>
            <div class="d-flex flex-wrap gap-3">
              <div v-for="media in review.media" :key="media.mediaId" class="media-item">
                <img
                  v-if="media.reviewType === 'image'"
                  :src="'http://localhost:8080/images/' + media.reviewUrl"
                  alt="Review Media"
                  class="img-fluid"
                  style="max-width: 200px"
                />
                <video
                  v-else-if="media.reviewType === 'video'"
                  :src="'http://localhost:8080/images/' + media.reviewUrl"
                  controls
                  class="img-fluid"
                  style="max-width: 200px"
                ></video>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="closeModal"
          >
            Đóng
          </button>
        </div>
      </div>
      <div v-else class="modal-content">
        <div class="modal-body text-center">
          <p v-if="loading">Đang tải chi tiết đánh giá...</p>
          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
            <button @click="error = null" class="btn btn-sm btn-outline-danger">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getReviewById } from "@/api/admin/reviewAPI";
import { Modal } from "bootstrap";
import { nextTick } from "vue";

export default {
  name: "ReviewModal",
  props: {
    reviewId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      review: null,
      loading: false,
      error: null,
      modalInstance: null,
    };
  },
  methods: {
    formatDate(date) {
      return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(date));
    },
    async fetchReview() {
      this.loading = true;
      this.error = null;
      try {
        this.review = await getReviewById(this.reviewId);
        await nextTick();
        this.showModal();
      } catch (error) {
        console.error("Error fetching review:", error.message);
        this.error = "Không thể tải chi tiết đánh giá.";
      } finally {
        this.loading = false;
      }
    },
    showModal() {
      const modalElement = document.getElementById("reviewModal" + this.reviewId);
      if (modalElement) {
        if (this.modalInstance) {
          this.modalInstance.dispose?.();
        }
        this.modalInstance = new Modal(modalElement, {
          backdrop: "static",
          keyboard: false,
        });
        this.modalInstance.show();
      }
    },
    closeModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
        this.modalInstance.dispose?.();
        this.modalInstance = null;
      }
      this.review = null;
      this.$emit("close");
    },
  },
  watch: {
    reviewId: {
      immediate: true,
      async handler(newReviewId) {
        if (newReviewId) {
          await this.fetchReview();
        }
      },
    },
  },
};
</script>

<style scoped>
.modal-content {
  background-color: #f8f9fa;
}
.bg-primary {
  background-color: #3498db !important;
}
.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}
.media-item {
  display: inline-block;
  text-align: center;
}
.img-fluid {
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
