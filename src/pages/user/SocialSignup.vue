<template>
  <div class="social_signup_container">
    <header class="header_container">
      <button class="back" @click="goBack">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <p class="title">소셜 회원가입</p>
    </header>

    <form @submit.prevent="submitSignup">
      <!-- 이름 -->
      <div class="input_group">
        <label for="name">이름</label>
        <input
          v-model="formData.name"
          type="text"
          id="name"
          disabled
        />
      </div>

      <!-- 생년월일 -->
      <div class="input_group">
        <label for="birth">생년월일</label>
        <input
          v-model="formData.birth"
          type="text"
          id="birth"
          disabled
        />
      </div>

      <!-- 이메일 -->
      <div class="input_group">
        <label for="email">이메일</label>
        <input
          v-model="formData.email"
          type="email"
          id="email"
          disabled
        />
      </div>

      <!-- 성별 -->
      <div class="input_group">
        <label for="gender">성별</label>
        <select
          v-model="formData.gender"
          id="gender"
          disabled
        >
          <option value="남성">남성</option>
          <option value="여성">여성</option>
        </select>
      </div>

      <!-- 닉네임 -->
      <div class="input_group">
        <label for="nickname">닉네임</label>
        <input
          v-model="formData.nickname"
          type="text"
          id="nickname"
          placeholder="닉네임을 입력하세요"
          required
        />
      </div>

       <!-- 정보제공 이용 및 동의 -->
       <div class="terms_section">
        <div>
          <p>전체 동의</p>
          <label class="slider">
            <input
              type="checkbox"
              v-model="allAgree"
              @change="toggleAll"
            />
            <span class="slider-knob"></span>
          </label>
        </div>

        <div v-for="(term, index) in terms" :key="index" class="term_item">
          <div>
            <label>{{ term.utilTitle }}</label>
            <button @click="toggleShowTermContent(index)">
              {{ term.showContent ? '▲' : '▼' }}
            </button>
          </div>
          <div v-if="term.showContent">
            <p>{{ term.utilContent }}</p>
          </div>

          <p>동의</p>
          <label class="slider">
            <input
              type="checkbox"
              v-model="term.agreed"
            />
            <span class="slider-knob"></span>
          </label>
        </div>
      </div>

      <!-- 가입하기 버튼 -->
      <button type="submit" class="signup_button">
        가입하기
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import UserApi from '@/api/UserApi';
import { useRouter } from 'vue-router';

const router = useRouter();

// 소셜 로그인 후 받아온 데이터를 formData에 저장
const formData = ref({
  name: '', // 소셜 로그인에서 받아온 이름
  birth: '', // 소셜 로그인에서 받아온 생년월일
  email: '', // 소셜 로그인에서 받아온 이메일
  gender: '', // 소셜 로그인에서 받아온 성별
  nickname: '', // 사용자가 입력할 닉네임
});

// 약관 데이터 배열
const terms = ref([]);

// 전체 동의 체크박스 상태
const allAgree = ref(false);

// 약관 표시 토글 함수
const toggleShowTermContent = (index) => {
  terms.value[index].showContent = !terms.value[index].showContent;
};

// 전체 동의 체크박스 동작
const toggleAll = () => {
  terms.value.forEach((term) => {
    term.agreed = allAgree.value;
  });
};

// 약관 데이터를 불러오는 함수
const getTerms = async () => {
  try {
    const response = await UserApi.getTerms(); // API 호출
    console.log("약관 API 응답:", response); // 응답 데이터 확인
    terms.value = response.map((term) => ({
      ...term,
      agreed: false, // 동의 상태 추가
      showContent: false, // 내용 표시 여부 추가
    }));
    console.log("바인딩된 terms.value:", terms.value); // 데이터가 바인딩되었는지 확인
  } catch (error) {
    console.error("약관 데이터를 불러오는 중 오류 발생:", error);
  }
};

// 소셜 로그인 정보를 불러오는 함수
const loadSocialLoginData = async () => {
  try {
    const response =
      await UserApi.socialSignupInfo();
    if (response) {
      formData.value.name = response.name;
      formData.value.birth = response.birth;
      formData.value.email = response.email;
      formData.value.gender =
        response.gender === 'M' ? '남성' : '여성';
    }
  } catch (error) {
    console.error(
      '소셜 로그인 정보 로딩 중 오류 발생:',
      error
    );
  }
};

// 폼 제출 함수
const submitSignup = async () => {
  try {
    const response =
      await UserApi.socialSignupRegister({
        name: formData.value.name,
        birth: formData.value.birth,
        email: formData.value.email,
        gender: formData.value.gender === '남성',
        nickname: formData.value.nickname,
      });

    if (response) {
      alert('가입이 완료되었습니다!');
      router.push('/home'); // 가입 완료 후 홈으로 이동
    }
  } catch (error) {
    console.error('가입 중 오류 발생:', error);
    alert('가입 중 오류가 발생했습니다.');
  }
};

// 페이지 로드 시 소셜 로그인 정보와 약관 데이터 불러오기
onMounted(() => {
  loadSocialLoginData();
  getTerms();
});

// 뒤로가기 함수
const goBack = () => {
  window.history.back();
};
</script>

<style>
.social_signup_container {
  padding: 20px;
  text-align: center;
}

.header_container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.title {
  flex: 1;
  text-align: center;
  margin-right: 24px;
}

.back {
  background: none;
  border: none;
  font-size: 24px;
}

.input_group {
  margin-bottom: 16px;
  text-align: left;
}

.input_group label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  text-align: left;
}

.input_group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.terms_section {
  margin: 20px 0;
  text-align: left;
}

.term_item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
}

.term_title {
  display: flex;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
}

.term_content {
  margin-top: 10px;
}

.submit_button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.submit_button:hover {
  background-color: #0056b3;
}

/* 추가된 스위치 스타일 */
.slider {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.slider input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider-knob {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider-knob:before {
  position: absolute;
  content: '';
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider-knob {
  background-color: #2196f3;
}

input:checked + .slider-knob:before {
  transform: translateX(26px);
}
</style>
