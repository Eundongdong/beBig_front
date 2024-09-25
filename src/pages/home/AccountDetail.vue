<template>
    <div class="account-detail">
        <h2>은행 계좌 상세 정보</h2>
        <p>계좌 이름: {{ accountName }}</p>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const accountName = route.query.accountName;  // 쿼리에서 계좌 이름을 받아옴
console.log(accountName);
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>
