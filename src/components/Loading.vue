<template>
    <div :class="['loading-container', isFading ? 'fade-out' : '']">
    <img src="/images/logo.png" class="logo" />
  </div>

  </template>
  
  <script setup>
import { ref, onMounted } from 'vue';

const isFading = ref(false);

onMounted(() => {
  // 1초 후 페이드 아웃 애니메이션 시작
  setTimeout(() => {
    isFading.value = true;
  }, 1000);
});
  </script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color:#5354ff; /* 검정 배경에 불투명도 50% */
  z-index: 1000;
  transition: background-color 1s ease; /* 배경색 페이드 효과 */
}

.logo {
  width: 200px;
  height: auto;
  transition: opacity 1s ease; /* 로고 희미해짐 효과 */
}

.fade-out {
  background-color: rgba(0, 0, 0, 0); /* 배경 불투명도 0% */
}

.fade-out .logo {
  opacity: 0; /* 로고 희미해짐 */
}
</style>