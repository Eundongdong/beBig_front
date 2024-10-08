<template>
  <div class="flex flex-col relative">
    <Header v-if="!isUserPage"/>
    <div class="flex-1 mt-[50px] lg:mt-0 mb-2 overflow-y-auto">
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

<style scoped> </style>