
코드 복사
<template>
    <div>
        <h1>자산 관련 API 테스트</h1>
        <button @click="testAssetApi">API 테스트</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import assetApi from "@/api/AssetApi";

const userNo = ref(1); // 테스트할 사용자 번호

const testAssetApi = async () => {
    try {
        // 총 자산 분석 테스트
        const analysis = await assetApi.showAnalysis(userNo.value);
        console.log("총 자산 분석 결과:", analysis);

        // 소비패턴 분석 테스트
        const spendingPatterns = await assetApi.showSpendingPatterns(userNo.value);
        console.log("소비 패턴 분석 결과:", spendingPatterns);

        // 예적금 상품 추천 테스트
        const productRecommendations = await assetApi.showProductRecommendations(userNo.value);
        console.log("예적금 상품 추천 결과:", productRecommendations);

        // 나이별 자산 비교 테스트
        const ageComparison = await assetApi.showAgeComparison(userNo.value);
        console.log("나이별 자산 비교 결과:", ageComparison);

    } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
    }
};
</script>

<style scoped>

</style>