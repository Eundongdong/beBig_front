<template>
  <div class="page">
    <div class="survey-start">
      <button @click="goBack" class="back-button">
        <i class="fas fa-arrow-left"></i>
      </button>
      <div class="text-lg mt-3">
        <p>안녕하세요.</p>
        <p>내가 어떤 자산 관리 유형인지</p>
        <p>확인해보시겠어요?</p>
        <p>검사는 2분 정도 걸려요.</p>
        <p>처음 시작하면 뒤로 가기 어려워요.</p>
      </div>
      <button @click="goToSurvey" class="button mt-5">
        유형 검사 하러 가기
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  // router.push({name: 'main'});
  router.back();
};

const goToSurvey = () => {
  router.push({ name: "survey" });
};
</script>
