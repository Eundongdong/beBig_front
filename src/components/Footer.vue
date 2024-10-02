<template>
    <footer class="fixed bottom-4 left-4 right-4 bg-gray-100 rounded-3xl shadow-lg z-50">
        <nav class="h-20 flex items-center justify-around">
            <button @click="goHome" :class="getButtonClass(isHome)">
                <i class="fas fa-home text-2xl md:text-3xl"></i>
                <span class="text-xs mt-1 md:mt-2">홈</span>
            </button>
            <button @click="goAsset" :class="getButtonClass(isAsset)">
                <i class="fas fa-chart-simple text-2xl md:text-3xl"></i>
                <span class="text-xs mt-1 md:mt-2">자산분석</span>
            </button>
            <button @click="goCommunity" :class="getButtonClass(isCommunity)">
                <i class="fas fa-file-lines text-2xl md:text-3xl"></i>
                <span class="text-xs mt-1 md:mt-2">커뮤니티</span>
            </button>
            <button @click="goMypage" :class="getButtonClass(isMypage)">
                <i class="fas fa-user text-2xl md:text-3xl"></i>
                <span class="text-xs mt-1 md:mt-2">마이페이지</span>
            </button>
        </nav>
    </footer>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

// 라우팅 정보에 따라 버튼 색상 변경
const isHome = computed(() => route.path === '/home');
const isAsset = computed(() => route.path.startsWith('/asset'));
const isCommunity = computed(() => route.path.startsWith('/community'));
const isMypage = computed(() => route.path.startsWith('/mypage'));

// 라우터 이동 함수
const goHome = () => {
    router.push({ name: 'main' });
};
const goAsset = () => {
    router.push({ name: 'asset' });
};
const goCommunity = () => {
    router.push({ name: 'communityList' });
};
const goMypage = () => {
    router.push({ name: 'mypage' })
};

const getButtonClass = (isActive) => {
    return `flex flex-col items-center justify-center w-1/4 focus:outline-none transition-colors duration-200 ${isActive ? 'text-black' : 'text-gray-500 hover:text-gray-700'
        }`;
};
</script>

<style scoped></style>
