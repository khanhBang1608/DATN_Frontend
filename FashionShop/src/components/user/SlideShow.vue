<script setup>
import { onMounted, nextTick } from "vue";
import initSlideshow from "@/assets/js/slideshow.js";
const slides = [
  {
    img: "https://picsum.photos/id/1025/1920/1080",
    title: "Galaxy S24 Ultra",
    description:
      "Trải nghiệm đột phá với AI. Sáng tạo, mạnh mẽ và hiệu quả hơn bao giờ hết.",
    button: "Tìm hiểu ngay",
  },
  {
    img: "https://picsum.photos/id/1026/1920/1080",
    title: "Neo QLED 8K",
    description: "Mở ra kỷ nguyên TV siêu thực, với độ chi tiết vượt thời gian.",
    button: "Khám phá",
  },
  {
    img: "https://picsum.photos/id/1027/1920/1080",
    title: "Galaxy Watch6",
    description: "Giấc ngủ trọn vẹn, sức khỏe toàn diện trong tầm tay bạn.",
    button: "Đặt mua ngay",
  },
];
onMounted(() => {
  nextTick(() => {
    initSlideshow();
  });
});
</script>
<template>
  <div class="slider swiper">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide slider-slide"
        v-for="(slide, index) in slides"
        :key="index"
      >
        <img class="slider-image" :src="slide.img" :alt="slide.title" />
        <div class="slider-info">
          <h2 class="slider-title">{{ slide.title }}</h2>
          <p class="slider-description">{{ slide.description }}</p>
          <a href="#" class="slider-button">{{ slide.button }}</a>
        </div>
      </div>
    </div>

    <div class="swiper-button-next slider-nav-next"></div>
    <div class="swiper-button-prev slider-nav-prev"></div>
    <div class="swiper-pagination slider-pagination"></div>
  </div>
</template>
<style src="./src/assets/css/slideshow.css"></style>
