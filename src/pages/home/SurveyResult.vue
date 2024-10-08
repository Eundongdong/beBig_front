<template>
  <div class="page">
    <div class="component space-y-2">
      <h1 class="giant-text text-center">{{ finTypeTitle }}</h1>
      <h2 class="text-xl text-center">{{ finTypeSubtitle }}</h2>
      <div class="flex items-center justify-center">
      <img :src="`/images/${finTypeCode}.png`" alt="finType 이미지" class="w-[150px] h-auto rounded-full" />
    </div>


      <div class="fintype-description">
        <div><p class="text-justify"><span class="font-semibold">{{ userName }}</span> 님은 {{ finTypeTitleDescription}}</p></div>
        <div><p class="text-justify">{{ finTypeAnimalDescription}}</p></div>
        <ul class="list-none text-justify mt-4">
          <li :key="advice">{{ finTypeHabit1}}</li>
          <li :key="advice">{{ finTypeHabit2}}</li>
        </ul>
      </div>
      <button class="button mt-5" @click="handleButtonClick">{{ buttonText }}</button>
    </div>
  </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
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
  
  const props = defineProps({
  isModal: {
    type: Boolean,
    default: false
  }
});

  const buttonText = computed(() => props.isModal ? '닫기' : '홈으로 돌아가기');

// 버튼 클릭 처리 함수
const handleButtonClick = () => {
  if (props.isModal) {
    emit('close-modal');
  } else {
    router.push({ name: 'main' });
  }
};

// emit 정의
const emit = defineEmits(['close-modal']);

  </script>