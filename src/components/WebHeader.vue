<template>
  <nav class="hidden lg:flex justify-between items-center px-8 py-2 bg-white shadow-lg fixed top-0 left-0 w-full z-50 ">
    <div><img src="/images/logo.png" alt="Logo" @click="goHome" class="w-28 mt-2 cursor-pointer" /></div>
    <div>
      <ul class="flex space-x-10 text-base">
        <li><router-link to="/asset" class="hover:text-blue-500" :class="{ 'text-blue-500 font-bold': isAssetActive }">내 자산분석</router-link></li>
        <li><router-link to="/community" class="hover:text-blue-500" :class="{ 'text-blue-500 font-bold': isCommunityActive }">커뮤니티</router-link></li>
        <li><router-link to="/mypage" class="hover:text-blue-500" :class="{ 'text-blue-500 font-bold': isMypageActive }">마이페이지</router-link></li>
        <li><button @click="logout" class="hover:text-blue-500">로그아웃</button></li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

const goHome = () => {
  router.push({ name: 'main' });
};

// 로그아웃 함수 추가
const logout = async () => {
  try {
    const response = refreshToken.logouting();
  } catch (error) {
    // console.log(error);
  }
  router.push('/');
};

// 메뉴 활성화 상태를 체크
const isAssetActive = computed(() => route.path.startsWith('/asset'));
const isCommunityActive = computed(() => route.path.startsWith('/community'));
const isMypageActive = computed(() => route.path === '/mypage');
</script>
