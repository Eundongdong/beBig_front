<template>
  <div class="page">
    <div class="section-style mt-4 flex flex-col justify-center">
      <div class="flex justify-end">
        <p class="text-sm">
          <span class="font-semibold">{{ currentQuestion + 1 }}</span> / {{ shuffledQuestions.length }}
        </p>
      </div>
      <div v-if="currentQuestion < shuffledQuestions.length - 1" class="flex flex-col items-center justify-center space-y-4 mt-5">
        <h2 class="flex text-xl font-semibold">{{ shuffledQuestions[currentQuestion].finTestQuestion }}</h2>
        <div class="flex flex-col justify-center pt-4">
          <button @click="selectAnswer(1, shuffledQuestions[currentQuestion].finTestType)" class="answer-button lg:hover:bg-gray-200">
            {{ shuffledQuestions[currentQuestion].finTestAnswer1 }}
          </button>
          <button @click="selectAnswer(2, shuffledQuestions[currentQuestion].finTestType)" class="answer-button lg:hover:bg-gray-200 mt-2">
            {{ shuffledQuestions[currentQuestion].finTestAnswer2 }}
          </button>
        </div>
      </div>
      <div v-else class="flex lg:w-[650px] flex-col items-center justify-center space-y-2 mt-5">
        <h2 class="text-xl font-semibold">{{ shuffledQuestions[currentQuestion].finTestQuestion }}</h2>
        <p>입력하신 월 수입은 미션 제공과 자산 분석에만 사용돼요.</p>
        <div class="flex items-center mt-2">
          <input class="input mr-2" v-model="formattedIncome" type="text" placeholder="월 수입을 입력하세요" />
          원
        </div>
        <p v-if="isSubmitted && !isFormValid" class="text-red-500 text-sm">월 수입을 입력해주세요.</p>
        <button class="button" @click="submitSurvey">제출하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HomeApi from '@/api/HomeApi';

const router = useRouter();
const currentQuestion = ref(0);
const answers = ref([]);
const income = ref('');

const questions = reactive([
  {
    finTestId: '',
    finTestQuestion: '',
    finTestAnswer1: '',
    finTestAnswer2: '',
    finTestType: '',
  },
]);

onMounted(() => {
  getQuestion();
});

const isSubmitted = ref(false); // 제출 버튼을 눌렀는지 여부

const isFormValid = computed(() => {
  return income.value; // 수입 값이 유효한지 판단
});

const getQuestion = async () => {
  try {
    const response = await HomeApi.surveyList();
    for (let i = 0; i < 11; i++) {
      questions[i] = response[i];
    }
    shuffle();
  } catch (error) {
    //console.error("API 호출 중 오류 발생:", error);
  }
};

// 질문 섞기
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const shuffledQuestions = reactive([{}]);
const shuffle = () => {
  const shuffled = shuffleArray(questions.slice(0, 10)).concat(questions[10]);
  shuffledQuestions.splice(0, shuffledQuestions.length, ...shuffled);
};

// 1~10번 질문을 섞되, 마지막 질문(11번)은 고정
//const shuffledQuestions = shuffleArray(questions.slice(0, 10)).concat(questions[10]);

const formattedIncome = computed({
  get: () => {
    return income.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  set: (value) => {
    income.value = value.replace(/[^\d]/g, '');
  },
});

const selectAnswer = (choice) => {
  answers.value.push(choice);
  currentQuestion.value++;
};

const submitSurvey = () => {
  isSubmitted.value = true;
  if (isFormValid.value) {
    // finTestType이 1일 때의 답변 개수를 카운트
    const finType1Count1 = answers.value.filter((a, i) => shuffledQuestions[i].finTestType === 1 && a === 1).length;
    const finType1Count2 = answers.value.filter((a, i) => shuffledQuestions[i].finTestType === 1 && a === 2).length;

    // finTestType이 2일 때의 답변 개수를 카운트
    const finType2Count1 = answers.value.filter((a, i) => shuffledQuestions[i].finTestType === 2 && a === 1).length;
    const finType2Count2 = answers.value.filter((a, i) => shuffledQuestions[i].finTestType === 2 && a === 2).length;

    let finType = '';

    // a: finTestType이 1일 때 1이 더 많음
    const a = finType1Count1 > finType1Count2;
    // b: finTestType이 1일 때 2가 더 많음
    const b = finType1Count1 < finType1Count2;
    // c: finTestType이 2일 때 1이 더 많음
    const c = finType2Count1 > finType2Count2;
    // d: finTestType이 2일 때 2가 더 많음
    const d = finType2Count1 < finType2Count2;

    // 조건에 따라 finType 결정
    if (a && c) {
      finType = 1; // a, c이면 finType1
    } else if (a && d) {
      finType = 2; // a, d이면 finType2
    } else if (b && c) {
      finType = 3; // b, c이면 finType3
    } else if (b && d) {
      finType = 4; // b, d이면 finType4
    }

    // console.log("결정된 자산 유형:", f  inType);

    sendSurveyResult(finType);
  }
};

const sendSurveyResult = async (finType) => {
  try {
    // console.log(income.value);
    const response = await HomeApi.submitSurvey({
      user_fin_type: finType,
      user_income: income.value,
    });
    router.push('/home/survey-result');
  } catch (error) {
    //  console.error("API 호출 중 오류 발생:", error);
  }
};
</script>
