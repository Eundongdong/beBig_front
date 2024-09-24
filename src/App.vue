<template>
  <div class="app-container">
    <Header v-if="!isUserPage"/>
    <div class="content-wrapper">
      <RouterView/>
    </div>
    <Footer v-if="!isUserPage"/>
  </div>
</template>
<script setup>
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"

import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isUserPage = ref(route.path.startsWith('/user'));

// 경로가 변경될 때마다 isUserPage 업데이트
watch(route, (newRoute) => {
  isUserPage.value = newRoute.path.startsWith('/user');
});

</script>

<style scoped>
    .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .content-wrapper {
    flex: 1;
    margin-top: 60px; /* 헤더 높이 */
    margin-bottom: 60px; /* 푸터 높이 */
    overflow-y: auto;
  }
</style>