<template>
    <div class="survey-container">
        <p>{{ currentQuestion + 1 }} / {{ questions.length }}</p>
        <div v-if="currentQuestion < questions.length - 1">
            <h2>{{ questions[currentQuestion].question }}</h2>
            <button @click="selectAnswer(1)">{{ questions[currentQuestion].answer1 }}</button>
            <button @click="selectAnswer(2)">{{ questions[currentQuestion].answer2 }}</button>
        </div>
        <div v-else>
            <h2>{{ questions[currentQuestion].question }}</h2>
            <input v-model="formattedIncome" type="text" placeholder="월 소득을 입력하세요"> 원
            <button @click="submitSurvey">제출하기</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
//   import homeApi from '@/api/HomeApi';

const router = useRouter();
const currentQuestion = ref(0);
const answers = ref([]);
const income = ref('');

const questions = [
    { question: "보너스나 뜻밖의 돈이 들어온다면…", answer1: "바로 짐 싸서 여행 가거나, 큰 지름을 위한 저축!", answer2: "일단 은행에 맡겨두고 생각해 볼래요." },
    { question: "저축할 때 나는…", answer1: "결혼, 이사, 유학 같은 큰 이벤트에 대비해 딱딱 계획적으로!", answer2: "그냥 되는 대로, 일단 돈이 많으면 좋잖아요?" },
    { question: "대출 받을 일이 생긴다면 나는…", answer1: "집이든 차든 꼭 필요한 큰 걸 위해서라면 대출을 생각해요.", answer2: "굳이 대출 받으면서 할 필요 있나요?" },
    { question: "친구가 새로운 투자 기회를 알려주면 나는…", answer1: "자산을 불리기 위해 투자? 언제든지 고려해볼 수 있지!", answer2: "안정적인 저축이 최고예요. 투자는 나랑 거리가 먼 이야기." },
    { question: "지금 내게 가장 중요한 재정 목표는…", answer1: "몇 년 안에 큰 목표 달성! (예: 전세 자금, 학비)", answer2: "나중을 위해 꾸준히 저축! 노후 대비가 중요하죠." },
    { question: "월급날이 오면 나는…", answer1: "생활비부터 해결하고 남는 건 저축!", answer2: "필요한 만큼 쓰고 나머지는 저축 모드!" },
    { question: "내 소비 습관을 돌아보면…", answer1: "외식도 자주하고, 여가활동에 쓰는 돈도 꽤 많아요.", answer2: "외식비나 여가비는 최소한으로! 저축이 우선이에요." },
    { question: "평소 지출할 때 나는…", answer1: "필요하다면 큰돈 쓰는 것도 OK! 아낌없이 투자.", answer2: "큰 돈은 최대한 미루고, 작은 지출로 생활!" },
    { question: "새로운 취미를 시작할 때 나는…", answer1: "필요한 장비나 도구에 아낌없이 투자하는 스타일!", answer2: "비용이 많이 든다면 다시 생각해볼래요." },
    { question: "한 달 생활비를 계획할 때 나는…", answer1: "계획은 하지만 예상치 못한 지출로 늘 예산을 초과해요.", answer2: "생활비를 철저히 계획하고 절제하며 지출하려고 해요." },
    { question: "이렇게 말한 당신, 달에 얼마버세요?", answer1: "", answer2: "" }
];

const formattedIncome = computed({
  get: () => {
    return income.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  set: (value) => {
    income.value = value.replace(/[^\d]/g, "");
  }
});

const selectAnswer = (choice) => {
    answers.value.push(choice);
    currentQuestion.value++;
};

const submitSurvey = async () => {
    if (!/^\d+$/.test(income.value)) {
        alert('숫자만 입력하세요.');
        return;
    }
    answers.value.push(income.value);
    console.log("제출된 답변: ", answers.value);
    try {
        // 실제 API 호출 (현재는 주석 처리)
        // const userNo = 1; // 사용자 번호는 실제 구현 시 동적으로 가져와야 합니다.
        // const response = await homeApi.submitSurvey(userNo, { answers: answers.value });

        // // 목 데이터 응답
        // const mockResponse = {
        //     success: true,
        //     message: "설문이 성공적으로 제출되었습니다.",
        //     data: {
        //         surveyResult: "저축형",
        //         description: "당신은 안정적인 재무 관리를 선호하는 저축형 입니다."
        //     }
        // };

        console.log("설문 제출 결과:");

        // 목데이터를 사용한 결과 생성
        const result = answers.value.filter(answer => answer === 1).length > 5 ? "투자형" : "저축형";

        // 결과 페이지로 이동
        router.push({ name: 'surveyResult', params: { result } });
        // router.push({ name: 'surveyResult', params: { result: mockResponse.data.surveyResult } });
    } catch (error) {
        console.error("설문 제출 중 오류 발생:", error);
        alert("설문 제출에 실패했습니다. 다시 시도해주세요.");
    }
};

onMounted(() => {
    // 컴포넌트 마운트 시 필요한 초기화 로직
});
</script>

<style scoped>
.survey-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
}

button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

input {
    margin: 20px 0;
    padding: 10px;
    font-size: 16px;
    width: 200px;
}
</style>