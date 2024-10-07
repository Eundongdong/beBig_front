<template>
  <div class="page">
    <div class="result-container">
      <h1 class="finType-title">{{ finTypeTitle }}</h1>
      <h2 class="finType-subtitle">{{ finTypeSubtitle }}</h2>
      <img :src="`/images/${finTypeCode}.png`" alt="finType 이미지" class="finType-image" />
      <div class="finType-description">
        <div ><p>{{ userName }} 님은 {{ finTypeTitleDescription}}</p></div>
        <div ><p>{{ finTypeAnimalDescription}}</p></div>
        <ul>
          <li :key="advice">{{ finTypeHabit1}}</li>
          <li :key="advice">{{ finTypeHabit2}}</li>
        </ul>
      </div>
      <button class="button" @click="goBack">홈으로 돌아가기</button>
    </div>
  </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import HomeApi from "@/api/HomeApi";
  const router = useRouter();

  const finTypeTitle = ref('');
  const finTypeSubtitle=ref('');
  const finTypeCode = ref('');
  const finTypeAnimalDescription = ref('');
  const finTypeHabit1 = ref('');
  const finTypeHabit2 = ref('');
  const finTypeTitleDescription = ref('');
  const userName = ref('');
  const getSurveyResult = async() => {
    try{
      const surveyResults = await HomeApi.surveyResult();
     // console.log(surveyResults);
      finTypeTitle.value = surveyResults.finTypeAnimal;
      finTypeSubtitle.value = surveyResults.finTypeTitle;
      finTypeCode.value = surveyResults.finTypeCode;
      finTypeAnimalDescription.value = surveyResults.finTypeAnimalDescription;
      finTypeHabit1.value = surveyResults.finTypeHabit1;
      finTypeHabit2.value = surveyResults.finTypeHabit2;
      finTypeTitleDescription.value = surveyResults.finTypeTitleDescription;
    }catch(error){
    //  console.error("API 호출 중 오류 발생:", error);
    }
  }
  const getUser = async()=>{
    try{
      const response = await HomeApi.getMyInfo();
      userName.value = response.userName;
    //  console.log(userName.value);
    }catch(error){
    //  console.error("API 호출 중 오류 발생:", error);
    }
  }
  // 페이지가 마운트될 때 finType에 맞는 데이터를 설정
  onMounted(() => {
    getSurveyResult();
    getUser();
  });
  
  // 홈으로 돌아가는 함수
  const goBack = () => {
    router.push({ name: 'main' });
  };
  </script>
  
  <style scoped>
  .result-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f9f9f9;
    height: 100vh;
  }
  
  .finType-title {
    font-size: 24px;
    color: #1a73e8;
    margin-bottom: 10px;
    text-align: center;
  }
  
  .finType-subtitle {
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .finType-image {
    width: 150px;
    height: auto;
    margin-bottom: 20px;
  }
  
  .finType-description {
    text-align: left;
    margin-bottom: 30px;
    max-width: 400px;
  }
  
  .finType-description p {
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
  }
  
  .finType-description ul {
    list-style-type: disc;
    margin-left: 20px;
  }
  
  .finType-description ul li {
    font-size: 14px;
    color: #777;
    margin-bottom: 5px;
  }
  
  .back-button {
    background-color: #1a73e8;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .back-button:hover {
    background-color: #1558c0;
  }
  </style>