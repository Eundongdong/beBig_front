<template>
  <Loading />
  <div class="flex flex-col relative">
    <Header v-if="!isUserPage" class="lg:hidden"/>
    <WebHeader v-if="!isUserPage" :key="footerStore.footerKey" class="hidden lg:flex w-full mx-auto" />
    <div :class="isUserPage ? 'flex-1 mt-0' : 'flex-1 mt-[50px] lg:mt-[50px] mb-2 overflow-y-auto'">
      <RouterView/>
    </div>
    <Footer v-if="!isUserPage" :key="footerStore.footerKey" class="lg:hidden"/>
  </div>
</template>

<script setup>
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"
import WebHeader from "./components/WebHeader.vue";
import Loading from "./components/Loading.vue";

import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useFooterStore } from '@/stores/footerStore';

const route = useRoute();
const footerStore = useFooterStore();
const isUserPage = ref(route.path.startsWith('/user'));


// 경로가 변경될 때마다 isUserPage 업데이트
watch(route, (newRoute) => {
  isUserPage.value = newRoute.path.startsWith('/user');
});



</script>

<style scoped> </style>