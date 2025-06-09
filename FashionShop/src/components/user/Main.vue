<template>
  <div class="scroll-wrapper mt-3" @mouseenter="pauseScroll" @mouseleave="resumeScroll">
    <div class="scroll-content" ref="scrollContent">
      <div
        v-for="(category, index) in categories"
        :key="index"
        class="product-category"
      >
        <a href="#" class="product-link">
          <img :src="category.image" :alt="category.alt" class="product-image" />
          <div class="product-title">{{ category.title }}</div>
        </a>
      </div>
    </div>
  </div>
</template>
<style src="./src/assets/css/main.css"></style>
<script setup>
import { ref } from 'vue'
import { useScrollCategory } from '@/assets/js/scrollcategory.js'
const categories = [
  { title: 'Giày & Dép', image: 'src/assets/img/slideshow_1.png', alt: 'Giày cao gót' },
  { title: 'Quần & Áo', image: 'src/assets/img/slideshow_1.png', alt: 'Quần áo thời trang' },
  { title: 'Áo', image: 'src/assets/img/slideshow_1.png', alt: 'Áo mới' },
  { title: 'Balo', image: 'src/assets/img/slideshow_1.png', alt: 'Balo đẹp' },
  { title: 'Túi Ví', image: 'src/assets/img/slideshow_1.png', alt: 'Túi và ví' },
  { title: 'Phụ Kiện', image: 'src/assets/img/slideshow_1.png', alt: 'Phụ kiện thời trang' }
]

const scrollContent = ref(null)
const { pauseScroll, resumeScroll } = useScrollCategory(scrollContent)
</script>
