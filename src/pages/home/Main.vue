<template>
    <div>
        <h1>Home API 테스트</h1>
        <button @click="testHomeApi">API 테스트</button>
    </div>
</template>

<script setup>
    import HomeApi from "@/api/HomeApi";
    import { ref } from 'vue';

    const userNo = ref(1); // 테스트할 사용자 번호
    
    const testHomeApi = async () => {
        try {
        // 내정보 가져오기 테스트
        const myInfo = await HomeApi.getMyInfo(userNo.value);
        console.log("내 정보:", myInfo);
    
        // 설문조사 가져오기 테스트
        const surveys = await HomeApi.surveyList(userNo.value);
        console.log("설문조사 목록:", surveys);
    
        // 설문 결과 보내기 테스트
        const surveyData = { answer: "응답" }; // 예시 데이터
        const surveySubmission = await HomeApi.submitSurvey(userNo.value, surveyData);
        console.log("설문 제출 결과:", surveySubmission);
    
        // 설문 결과 내용 조회 테스트
        const surveyResults = await HomeApi.surveyResult(userNo.value);
        console.log("설문 결과:", surveyResults);
    
        // 계좌 추가 테스트
        const newAccount = { accountName: "새 계좌", balance: 1000 }; // 예시 데이터
        const accountAddition = await HomeApi.addAccount(userNo.value, newAccount);
        console.log("계좌 추가 결과:", accountAddition);
    
        // 미션보기 테스트
        const missions = await HomeApi.missionList(userNo.value);
        console.log("미션 목록:", missions);
    
        // 계좌 목록 조회 테스트
        const accountList = await HomeApi.accountList(userNo.value);
        console.log("계좌 목록:", accountList);
    
        // 거래 내역 조회 테스트
        const accountNum = "계좌번호"; // 실제 계좌번호로 변경
        const transactions = await HomeApi.transactionList(userNo.value, accountNum);
        console.log("거래 내역:", transactions);
    
        } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        }
};
</script>

<style scoped>

</style>
