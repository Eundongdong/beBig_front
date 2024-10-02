<template>
  <div class="page">
    <div class="survey-start">
      <button @click="handleBack" class="back-button">&lt;</button>
      <p>안녕하세요.</p>
      <p>내가 어떤 자산 관리 유형인지</p>
      <p>확인해보시겠어요?</p>
      <p>검사는 2분 정도 걸려요.</p>
      <p>처음 시작하면 뒤로 가기 어려워요.</p>
      <button @click="goToSurvey" class="start-button">유형 검사 하러 가기</button>
    </div>
  </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const handleBack = () => {
    router.go(-1);
  };
  
  const goToSurvey = () => {
    router.push({name: 'survey'});
  };
  </script>
  
  <style scoped>
  .survey-start {
    text-align: center;
    padding: 20px;
  }
  
  .back-button {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .start-button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
  }
  </style>