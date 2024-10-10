<template>
  <div class="lg:grid lg:grid-cols-3 lg:h-screen">
    <!-- 왼쪽 파란 배경 (웹에서만 적용) -->
    <div class="hidden lg:flex lg:bg-[#5354ff] lg:items-center lg:justify-center">
      <img src="/images/logo.png" class="w-[50%]" alt="Logo" />
    </div>

    <div class="flex flex-col justify-start items-center lg:col-span-2 mt-6">
      <header class="w-full flex justify-between items-center mb-6 px-6 relative">
        <button class="text-xl" @click="goBack">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <span class="font-bold text-base absolute left-1/2 transform -translate-x-1/2">회원가입</span>
      </header>

      <form @submit.prevent class="max-w-lg w-full px-6">
        <!-- 이름 -->
        <div class="input_name">
          <label class="label" for="name">이름</label>
          <input id="name" class="input" type="text" v-model="User.name" placeholder="이름을 입력하세요" required />
        </div>
        <!-- 아이디 -->
        <div class="input_id">
          <label class="label" for="id">아이디</label>
          <input class="input" id="id" type="text" v-model="User.userLoginId" placeholder="ID를 입력하세요" @change="idDupCheckAPI" required />
          <p class="notification-text" v-if="idDupCheckResult && User.userLoginId">이미 사용 중인 아이디입니다.</p>
          <p class="notification-text" v-if="idDupCheckOk && User.userLoginId" style="color: blue">사용가능한 아이디입니다.</p>
        </div>

        <!-- 비밀번호 -->
        <div class="input_password">
          <label class="label" for="password">비밀번호</label>
          <input class="input" id="password" type="password" v-model="User.password" placeholder="비밀번호를 입력하세요" required />
        </div>

        <!-- 비밀번호 확인 -->
        <div class="input_password_check">
          <label class="label" for="password_check">비밀번호 확인</label>
          <input id="password_check" class="input" type="password" v-model="checkPassword" placeholder="비밀번호를 다시 한번 입력하세요" required />
          <p class="notification-text" v-if="pwdChecking && checkPassword">비밀번호가 다릅니다.</p>
        </div>

        <!-- 닉네임 -->
        <div class="input_nickname">
          <label class="label" for="nickname">닉네임</label>
          <input class="input" id="nickname" type="text" v-model="User.nickname" placeholder="닉네임을 입력해주세요" @change="nicknameDupCheckAPI" required />
          <p class="notification-text" v-if="nicknameDupCheckResult && User.nickname">이미 사용 중인 아이디입니다.</p>
          <p class="notification-text" v-if="nicknameDupCheckOk && User.nickname" style="color: blue">사용가능한 아이디입니다.</p>
        </div>
        
        <!-- 이메일 -->
        <div class="input_email">
          <label class="label" for="email">이메일</label>
          <input class="input" id="email" type="text" v-model="User.email" placeholder="이메일을 입력해주세요" @input="validateEmail" @change="emailDupCheckAPI" required />
          <p class="notification-text" v-if="emailError && User.email">이메일 형식에 맞게 입력해주세요.</p>
          <p class="notification-text" v-if="emailDupCheckResult && User.email">이미 사용 중인 아이디입니다.</p>
          <p class="notification-text" v-if="emailDupCheckOk && User.email" style="color: blue">사용가능한 아이디입니다.</p>
        </div>

        <!-- 성별 -->
        <div class="input_gender">
          <label class="label" for="gender">성별</label>
          <div class="flex items-center px-3 py-2 mb-3">
            <label class="flex items-center space-x-2">
              <input class="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out" type="radio" v-model="User.gender" :value="false" />
              <span>남성</span>
            </label>

            <label class="flex items-center space-x-2 ml-3">
              <input class="form-radio h-4 w-4 text-pink-600 transition duration-150 ease-in-out" type="radio" v-model="User.gender" :value="true" />
              <span>여성</span>
            </label>
          </div>
        </div>

        <!-- 생년월일 -->
        <div class="input_birth">
          <label class="label" for="birth">생년월일</label>
          <input class="input" v-model="User.birth" type="text" id="birth" placeholder="YYYY-MM-DD" @input="validateBirthInput" required />
          <p class="notification-text" v-if="birthError && User.birth">올바른 형식(YYYY-MM-DD)으로 입력해주세요.</p>
        </div>

        <!-- 가입하기 버튼 -->
        <button @click="openTermsModal" type="submit" class="button !mt-6" :disabled="!isFormValid">가입하기</button>
      </form>

      <!-- 약관 동의 모달 -->
      <TermsModal v-if="isTermsModalOpen" :isOpen="isTermsModalOpen" :terms="terms" @close="closeTermsModal" @confirm="handleTermsConfirmation" />
    </div>
  </div>
</template>

<script setup>
import UserApi from '@/api/UserApi';
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TermsModal from './TermsModal.vue';

const router = useRouter();

const User = reactive({
  name: '',
  nickname: '',
  userLoginId: '',
  password: '',
  email: '',
  gender: '',
  birth: '',
  userLoginType: 'general',
});

const year = ref('');
const month = ref('');
const day = ref('');

//아이디 비번 닉네임 중복 체크 변수
const idDupCheckResult = ref(false);
const idDupCheckOk = ref(false);
const checkPassword = ref('');

// 이메일 중복 체크 변수
const emailDupCheckResult = ref(false);
const emailDupCheckOk = ref(false);

//닉네임 중복 체크 변수
const nicknameDupCheckResult = ref(false);
const nicknameDupCheckOk = ref(false);

// 에러 상태 저장
const emailError = ref(false);
const birthError = ref(false);

// 약관 데이터 배열
const terms = ref([]);
const isTermsModalOpen = ref(false);

// 약관 데이터를 불러오는 함수 (모든 약관의 동의 상태는 false로 초기화)
const getTerms = async () => {
  try {
    const response = await UserApi.getTerms();
    terms.value = response.map((term) => ({
      ...term,
      agreed: false,
    }));
  } catch (error) {
    //console.error("약관 데이터를 불러오는 중 오류 발생:", error);
  }
};

//비밀번호 체크
const pwdChecking = computed(() => {
  return User.password !== checkPassword.value && checkPassword.value.length > 0;
});

//ID 중복체크
const idDupCheckAPI = async () => {
  try {
    const idDupCheck = await UserApi.idDuplicateCheck(User.userLoginId);
    idDupCheckOk.value = true;
    idDupCheckResult.value = false;
  } catch (error) {
    idDupCheckOk.value = false;
    idDupCheckResult.value = true;
  }
};

//email 중복체크
const emailDupCheckAPI = async () => {
  try{
    const emailDupCheck = await UserApi.emailDuplicateCheck(User.email);
    emailDupCheck.value = true;
    emailDupCheckResult = false;
  } catch(error){
    emailDupCheckOk.value = false;
    emailDupCheckResult = true;
  }
}

//nickname 중복체크
const nicknameDupCheckAPI = async () => {
  try{
    const nicknameDupCheck = await UserApi.nicknameDuplicateCheck(User.nickname);
    nicknameDupCheck.value = true;
    nicknameDupCheckResult = false;
  } catch(error){
    nicknameDupCheckOk.value = false;
    nicknameDupCheckResult = true;
  }
}

// 이메일 유효성 검사 함수
const validateEmail = () => {
  // 이메일 형식 정규표현식
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 이메일이 유효하지 않으면 emailError를 true로 설정
  emailError.value = !emailPattern.test(User.email);
};

// 가입 버튼을 누를 때 모달을 열기
const openTermsModal = () => {
  isTermsModalOpen.value = true;
};

// 모달 닫기
const closeTermsModal = () => {
  isTermsModalOpen.value = false;
};

// 약관 동의 확인 처리
const handleTermsConfirmation = (agreedTerms) => {
  // 약관 동의 처리
  isTermsModalOpen.value = false;
  // 약관에 동의했으면 회원가입 처리
  signup();
};

// 생년월일 입력 유효성 검사 함수
const validateBirthInput = () => {
  const rawInput = User.birth.replace(/-/g, '');

  if (!/^\d*$/.test(rawInput)) {
    alert('숫자만 입력 가능합니다.');
    User.birth = rawInput.replace(/\D/g, '');
  }

  if (rawInput.length > 8) {
    alert('생년월일은 8자리 숫자로 입력해주세요.');
    User.birth = rawInput.slice(0, 8);
  }

  if (rawInput.length === 8) {
    const year = rawInput.slice(0, 4);
    const month = rawInput.slice(4, 6);
    const day = rawInput.slice(6, 8);
    User.birth = `${year}-${month}-${day}`;
  }

  birthError.value = !isValidDateFormat(User.birth);
};

// 모든 함수를 최상단에 선언합니다.
const isValidDateFormat = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return date && date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

// 폼 유효성 검사
const isFormValid = computed(() => {
  return (
    User.name &&
    User.userLoginId &&
    User.password &&
    checkPassword.value &&
    User.nickname &&
    User.email &&
    User.gender !== '' &&
    User.birth &&
    !emailError.value &&
    !birthError.value &&
    !idDupCheckResult.value &&
    !pwdChecking.value &&
    !emailDupCheckResult &&
    !nicknameDupCheckResult
  );
});

// 생년월일 자동 업데이트
watch([year, month, day], () => {
  if (year.value && month.value && day.value) {
    User.birth = `${year.value}-${month.value}-${day.value}`;
  }
});

//회원가입
const signup = async () => {
  //console.log(User);
  try {
    const response = await UserApi.signup(User);
    //console.log("회원가입 성공: ", response);
    router.push('/user');
  } catch (error) {
    // console.log("에러 =>", error);
  }
};

//뒤로가기
const goBack = () => {
  router.push({ name: 'user' });
};

onMounted(() => {
  getTerms();
});
</script>
