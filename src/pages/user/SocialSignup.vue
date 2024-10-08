<template>
  <div class="page">
    <header class="header">
      <button class="back-button" @click="goBack">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
    </header>

    <form @submit.prevent="openTermsModal" class="container">
      <!-- 이름 -->
      <div class="input_name">
        <label class="label" for="name">이름</label>
        <input
          class="disabled-input"
          v-model="formData.name"
          type="text"
          id="name"
          disabled
        />
      </div>

      <!-- 이메일 -->
      <div class="input_email">
        <label class="label" for="email">이메일</label>
        <input
          class="disabled-input"
          v-model="formData.email"
          type="email"
          id="email"
          disabled
        />
      </div>

      <!-- 생년월일 -->
      <div class="input_birth">
        <label class="label" for="birth">생년월일</label>
        <input
          class="input"
          v-model="formData.birth"
          type="text"
          id="birth"
          placeholder="YYYY-MM-DD"
          @input="validateBirthInput"
        />
      </div>

      <!-- 성별 -->

      <div class="input_gender">
        <label class="label">성별</label>
        <div class="flex items-center space-x-4 mb-3">
          <label class="flex items-center space-x-2">
            <input
              class="radio-button"
              type="radio"
              v-model="formData.gender"
              :value="false"
            />
            <span>남성</span>
          </label>
          <label class="flex items-center space-x-2">
            <input
              class="radio-button"
              type="radio"
              v-model="formData.gender"
              :value="true"
            />
            <span>여성</span>
          </label>
        </div>
      </div>

      <!-- 닉네임 -->
      <div class="input_nickname">
        <label class="label" for="nickname">닉네임</label>
        <input
          class="input"
          v-model="formData.nickname"
          type="text"
          id="nickname"
          placeholder="닉네임을 입력하세요"
          required
        />
      </div>

      <!-- 가입하기 버튼 -->
      <div class="button_signup">
        <button type="submit" class="button">가입하기</button>
      </div>
    </form>
    <!-- 약관 동의 모달 -->
    <TermsModal
    v-if="isTermsModalOpen"
  :isOpen="isTermsModalOpen"
  :terms="terms"
  @close="closeTermsModal"
  @confirm="handleTermsConfirmation"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import UserApi from "@/api/UserApi";
import { useRouter } from "vue-router";
import TermsModal from "./TermsModal.vue";

// 정규식을 이용한 생년월일 형식 검증
const isValidDateFormat = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regex)) return false;

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  return `${year}-${month}-${day}` === dateString;
};

const router = useRouter();

// formData를 ref로 선언
const formData = ref({
  name: "",
  email: "",
  gender: true, // 기본값을 남성으로 설정 (true)
  birth: "",
  nickname: "",
  userLoginType: "kakao",
  userLoginId: "",
  password: "kakao",
});

// 생년월일 입력 유효성 검사 함수(input)
const validateBirthInput = () => {
  // '-' 제외한 순수 숫자만 처리
  const rawInput = formData.value.birth.replace(/-/g, "");

  // 숫자가 아닌 문자가 있으면 알림
  if (!/^\d*$/.test(rawInput)) {
    formData.value.birth = rawInput.replace(/\D/g, ""); // 숫자가 아닌 문자는 제거
    // alert 대신 화면에 오류 메시지를 표시
    errorMessage.value = "숫자만 입력 가능합니다.";
  }

  // 입력이 8자리를 초과하면 알림
  if (rawInput.length > 8) {
    alert("생년월일은 8자리 숫자로 입력해주세요.");
    formData.value.birth = rawInput.slice(0, 8); // 8자리까지만 유지
  }

  // 8자리가 입력되면 자동으로 'YYYY-MM-DD' 형식으로 변환
  if (rawInput.length === 8) {
    const year = rawInput.slice(0, 4);
    const month = rawInput.slice(4, 6);
    const day = rawInput.slice(6, 8);
    formData.value.birth = `${year}-${month}-${day}`;
  }
};

// 약관 데이터 배열
const terms = ref([]);
const isTermsModalOpen = ref(false);

// 약관 데이터를 불러오는 함수 (모든 약관의 동의 상태는 false로 초기화)
const getTerms = async () => {
  const response = await UserApi.getTerms(); // API로부터 약관 데이터 불러옴
  terms.value = response.map((term) => ({
    ...term,
    agreed: false, // 모든 약관의 동의 상태를 false로 초기화
    showContent: false, // 약관 내용 표시 여부
  }));
};

// 소셜 로그인 후 localStorage에 저장된 데이터를 불러오는 함수
const loadSocialLoginData = () => {
  const userData = localStorage.getItem("socialUser");
  if (userData) {
    const parsedData = JSON.parse(userData);
    formData.value.name = parsedData.name || "";
    formData.value.email = parsedData.email || "";
    formData.value.gender = parsedData.gender === "M" ? true : false;
    formData.value.birth = parsedData.birth || "";
    formData.value.userLoginId = parsedData.userLoginId || "";
  }
};

const openTermsModal = () => {
  isTermsModalOpen.value = true;
};

const closeTermsModal = () => {
  isTermsModalOpen.value = false;
};

const handleTermsConfirmation = async (confirmedTerms) => {
  terms.value = confirmedTerms;
  isTermsModalOpen.value = false;

  // 모든 필수 약관에 동의했는지 확인
  const allTermsAgreed = terms.value.every((term) => term.agreed);

  if (allTermsAgreed) {
    await submitSignup();
  } else {
    alert("모든 약관에 동의해야 회원가입이 가능합니다.");
  }
};

// 폼 제출 함수
const submitSignup = async () => {
  try {
    const response = await fetch("http://localhost:8080/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData.value),
    });

    // 서버 응답 상태 확인
    if (!response.ok) {
      throw new Error("서버 응답 오류: " + response.status);
    }

    // 회원가입 성공 시 http://localhost:5173/user로 이동
    alert("가입이 완료되었습니다!");
    router.push("/user");
  } catch (error) {
    console.error("가입 중 오류 발생:", error);
    alert("가입 중 오류가 발생했습니다.");
  }
};

// 페이지가 로드되면 소셜 로그인 정보와 약관 데이터 불러오기
onMounted(() => {
  loadSocialLoginData();
  getTerms();
});

// 뒤로가기 함수
const goBack = () => {
  window.history.back();
};
</script>
