<template>
    <div class="survey-container">
        <p>{{ currentQuestion + 1 }} / {{ shuffledQuestions.length }}</p>
        <div v-if="currentQuestion < shuffledQuestions.length - 1">
            <h2>{{ shuffledQuestions[currentQuestion].question }}</h2>
            <button @click="selectAnswer(1)">{{ shuffledQuestions[currentQuestion].answer1 }}</button>
            <button @click="selectAnswer(2)">{{ shuffledQuestions[currentQuestion].answer2 }}</button>
        </div>
        <div v-else>
            <h2>{{ shuffledQuestions[currentQuestion].question }}</h2>
            <input v-model="formattedIncome" type="text" placeholder="월 소득을 입력하세요"> 원
            <button @click="submitSurvey">제출하기</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import homeApi from '@/api/HomeApi';

const router = useRouter();
const currentQuestion = ref(0);
const answers = ref([]);
const income = ref('');

const questions = [
    { question: "보너스나 뜻밖의 돈이 들어온다면…", answer1: "바로 짐 싸서 여행 가거나, 큰 지름을 위한 저축!", answer2: "일단 은행에 맡겨두고 생각해 볼래요.", group: 1 },
    { question: "저축할 때 나는…", answer1: "결혼, 이사, 유학 같은 큰 이벤트에 대비해 딱딱 계획적으로!", answer2: "그냥 되는 대로, 일단 돈이 많으면 좋잖아요?", group: 1 },
    { question: "대출 받을 일이 생긴다면 나는…", answer1: "집이든 차든 꼭 필요한 큰 걸 위해서라면 대출을 생각해요.", answer2: "굳이 대출 받으면서 할 필요 있나요?", group: 1 },
    { question: "친구가 새로운 투자 기회를 알려주면 나는…", answer1: "자산을 불리기 위해 투자? 언제든지 고려해볼 수 있지!", answer2: "안정적인 저축이 최고예요. 투자는 나랑 거리가 먼 이야기.", group: 1 },
    { question: "지금 내게 가장 중요한 재정 목표는…", answer1: "몇 년 안에 큰 목표 달성! (예: 전세 자금, 학비)", answer2: "나중을 위해 꾸준히 저축! 노후 대비가 중요하죠.", group: 1 },
    { question: "월급날이 오면 나는…", answer1: "생활비부터 해결하고 남는 건 저축!", answer2: "필요한 만큼 쓰고 나머지는 저축 모드!", group: 2 },
    { question: "내 소비 습관을 돌아보면…", answer1: "외식도 자주하고, 여가활동에 쓰는 돈도 꽤 많아요.", answer2: "외식비나 여가비는 최소한으로! 저축이 우선이에요.", group: 2 },
    { question: "평소 지출할 때 나는…", answer1: "필요하다면 큰돈 쓰는 것도 OK! 아낌없이 투자.", answer2: "큰 돈은 최대한 미루고, 작은 지출로 생활!", group: 2 },
    { question: "새로운 취미를 시작할 때 나는…", answer1: "필요한 장비나 도구에 아낌없이 투자하는 스타일!", answer2: "비용이 많이 든다면 다시 생각해볼래요.", group: 2 },
    { question: "한 달 생활비를 계획할 때 나는…", answer1: "계획은 하지만 예상치 못한 지출로 늘 예산을 초과해요.", answer2: "생활비를 철저히 계획하고 절제하며 지출하려고 해요.", group: 2 },
    { question: "마지막으로 월 수입은 얼마인가요?", answer1: "", answer2: "" }
];

// 질문 섞기
const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

// 1~10번 질문을 섞되, 마지막 질문(11번)은 고정
const shuffledQuestions = shuffleArray(questions.slice(0, 10)).concat(questions[10]);

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
    if (currentQuestion.value < questions.length - 1) {
        currentQuestion.value++;
    } else {
        // 모든 질문을 마쳤다면 설문 제출
        submitSurvey();
    }
};

const determineFinType = () => {
    // 1~5번 질문: answer1 = 목적이 있다, answer2 = 목적이 없다
    const hasGoal = answers.value.filter((a, i) => shuffledQuestions[i].group === 1 && a === 1).length >= 3;
    // 6~10번 질문: answer1 = 소비가 크다, answer2 = 소비가 작다
    const highConsumption = answers.value.filter((a, i) => shuffledQuestions[i].group === 2 && a === 1).length >= 3;


    let finType = '';
    if (hasGoal && highConsumption) {
        finType = 'finType1'; // 꿀벌
    } else if (!hasGoal && highConsumption) {
        finType = 'finType2'; // 호랑이
    } else if (hasGoal && !highConsumption) {
        finType = 'finType3'; // 다람쥐
    } else {
        finType = 'finType4'; // 나무늘보
    }

    console.log("결정된 자산 유형:", finType);
    return finType;
};

//api 통신으로 자산유형값 전송함
const determineFinTypeAndSendToApi = async () => {
    const finType = determineFinType(); // 동일한 방식으로 자산 유형 결정

    try {
        // 실제 API 호출
        const userNo = 1; // 사용자 번호는 동적으로 처리 필요
        const userSalary=income.value; //입력된 income을 user_salary로 전송
        const response = await homeApi.submitSurvey(userNo, { finType, user_salary: userSalary });

        // API 응답 데이터 확인을 위한 로그
        console.log("API 응답: ", response);

        // response 및 response.data가 존재하는지 확인
        if (response && response.data && response.data.success) {
            console.log("설문 제출 성공:", response.data.message);
            router.push({ name: 'surveyResult', params: { result: response.data.data.surveyResult } });
        } else {
            alert("설문 제출 실패: " + response.data.message);
        }
    } catch (error) {
        console.error("설문 제출 중 오류 발생:", error);
        alert("설문 제출에 실패했습니다.");
    }
};



const submitSurvey = async () => {
    if (!/^\d+$/.test(income.value)) {
        alert('숫자만 입력하세요.');
        return;
    }
    answers.value.push(income.value);
    console.log("제출된 답변: ", answers.value);
    try {
        const result = determineFinType(); // 설문 응답을 기반으로 자산 유형을 결정

        console.log("설문 제출 결과:", result);

        // 결과 페이지로 이동 (목데이터를 사용한 결과)
        router.push({ name: 'surveyResult', params: { result } });
        // router.push({ name: 'surveyResult', params: { result: mockResponse.data.surveyResult });

        // 실제 API 통신을 통해 자산유형 전송
        await determineFinTypeAndSendToApi();
    } catch (error) {
        console.error("설문 제출 중 오류 발생:", error);
        alert("설문 제출에 실패했습니다. 다시 시도해주세요.");
    }

};
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