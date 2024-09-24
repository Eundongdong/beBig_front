<template>
    <div class="footer-container">
        <ul class="footer">
            <li>
                <button @click="goCommunity" :class="{'active': isCommunity}">
                    <i class="fas fa-file-lines"></i> <!-- Community 아이콘 -->
                    <span>커뮤니티</span>
                </button>
            </li>
            <li>
                <button @click="goHome" :class="{'active': isHome}">
                    <i class="fas fa-home"></i> <!-- Home 아이콘 -->
                    <span>홈</span>
                </button>
            </li>
            <li>
                <button @click="goAsset" :class="{'active': isAsset}">
                    <i class="fas fa-chart-simple"></i> <!-- 자산 분석 아이콘 -->
                    <span>자산분석</span>
                </button>
            </li>
            <li>
                <button @click="goMypage" :class="{'active': isMypage}">
                    <i class="fas fa-user"></i> <!-- 마이페이지 아이콘 -->
                    <span>마이페이지</span>
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

// 라우팅 정보에 따라 버튼 색상 변경
const isCommunity = computed(() => route.path.startsWith('/community'));
const isHome = computed(() => route.path === '/home');
const isAsset = computed(() => route.path.startsWith('/asset'));
const isMypage = computed(() => route.path.startsWith('/mypage'));

// 라우터 이동 함수
const goCommunity = () => {
    router.push({ name: 'communityList' });
};
const goHome = () => {
    router.push({ name: 'main' });
};
const goAsset = () => {
    router.push({ name: 'asset' });
};
const goMypage = () => {
    router.push({ name: 'mypage' });
};
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px; /* 푸터 높이 조정 */
    background-color: #f0f0f0;
    border-radius: 20px 20px 0 0; /* 상단 모서리 둥글게 */
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px;
    z-index: 1000; /* 다른 요소 위로 */
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); /* 상단 그림자 효과 */
}

ul {
    list-style-type: none;
    display: flex;
    justify-content: space-around;
    padding: 0;
    margin: 0;
    width: 100%;
}

li {
    flex: 1;
    text-align: center;
}

button {
    background: none;
    border: none;
    font-size: 24px;
    color: #888888; /* 기본 아이콘 색상은 회색 */
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
}

button span {
    font-size: 12px;
    color: #888888; /* 기본 텍스트 색상은 회색 */
}

button.active {
    color: black; /* 선택된 아이콘과 텍스트의 색상은 검정색 */
}

button.active span {
    color: black; /* 선택된 텍스트의 색상도 검정색 */
}

button:focus {
    outline: none;
}
</style>
