<template>
    <div class="header">
        <img src="../../public/images/logo.png" alt="Logo" @click="goHome"/>
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    const router = useRouter();
    
    const goHome = () => {
        router.push({ name:'main' })
    }

</script>

<style scoped>
    * {
        box-sizing: border-box;
        width: 100%;
    }
    .header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 50px; /* 모바일에 적합한 헤더 높이 */
        background-color: white;
        z-index: 1000; /* 다른 요소 위에 위치하게 설정 */
        display: flex;
        align-items: center;
        justify-content: center;
    }
    img {
        width: 25%; /* 모바일에 적합한 로고 크기 */
        cursor: pointer;
    }
</style>