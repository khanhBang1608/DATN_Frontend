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
          <a :href="slide.link" class="slider-button">
            {{ slide.button }}
          </a>
        </div>
      </div>
    </div>

    <div class="swiper-button-next slider-nav-next"></div>
    <div class="swiper-button-prev slider-nav-prev"></div>
    <div class="swiper-pagination slider-pagination"></div>
  </div>
</template>

<script setup>
import useSlideshow from "@/assets/js/slideshow.js";
const { slides } = useSlideshow();
</script>

<style src="./src/assets/css/slideshow.css"></style>
