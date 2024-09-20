import api from "@/api";

const BASE_URL = "/asset";
const headers = { "Content-Type": "multipart/form-data" };

export default {
  // 총 자산 분석
    async showAnalysis(userNo) {
        const { data } = await api.get(`${BASE_URL}/${userNo}/analysis`);
        //console.log("ASSET GET LIST", data);
        return data;
    },

  // 소비패턴 분석
    async showSpendingPatterns(userNo) {
        const { data } = await api.get(`${BASE_URL}/${userNo}/spending-patterns`);
        //console.log("ASSET GET PATTERN", data);
        return data;
    },

  // 예적금 상품 추천
    async showProductRecommendations(userNo) {
        const { data } = await api.get(`${BASE_URL}/${userNo}/product-recommendations`);
        //console.log("ASSET GET RECOMMENTAIONS", data);
        return data;
    },

  // 나이별 자산 비교
    async showAgeComparison(userNo) {
        const { data } = await api.get(`${BASE_URL}/${userNo}/age-comparison`);
        //console.log("ASSET GET AGE-COMPARISON", data);
        return data;
    }
};