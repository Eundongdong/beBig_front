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
        <input v-model="formData.name" type="text" id="name" />
      </div>

      <!-- 생년월일 -->
      <div class="input_group">
        <label for="birth">생년월일 (YYYY-MM-DD)</label>
        <input
          v-model="formData.birth"
          type="text"
          id="birth"
          placeholder="YYYY-MM-DD"
        />
      </div>

      <!-- 이메일 -->
      <div class="input_group">
        <label for="email">이메일</label>
        <input v-model="formData.email" type="email" id="email" disabled />
      </div>

      <!-- 성별 -->
      <div class="input_group">
        <label for="gender">성별</label>
        <select v-model="formData.gender" id="gender">
          <option :value="true">남성</option>
          <option :value="false">여성</option>
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
            <input type="checkbox" v-model="allAgree" @change="toggleAll" />
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
            <input type="checkbox" v-model="term.agreed" />
            <span class="slider-knob"></span>
          </label>
        </div>
      </div>

      <!-- 가입하기 버튼 -->
      <button type="submit" class="signup_button" @click="submitSignup">
        가입하기
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import UserApi from '@/api/UserApi';
import { useRouter } from 'vue-router';

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
  name: '',
  email: '',
  gender: true, // 기본값을 남성으로 설정 (true)
  birth: '',
  nickname: '',
  userLoginType: 'kakao',
  password: 'kakao',
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

// 소셜 로그인 후 localStorage에 저장된 데이터를 불러오는 함수
const loadSocialLoginData = () => {
  const userData = localStorage.getItem('socialUser');
  if (userData) {
    const parsedData = JSON.parse(userData);
    formData.value.name = parsedData.name || '';
    formData.value.email = parsedData.email || '';
    formData.value.gender = parsedData.gender === 'M' ? true : false;
    formData.value.birth = parsedData.birth || '';
  }
};

// 약관 데이터를 불러오는 함수
const getTerms = async () => {
  try {
    const response = await UserApi.getTerms(); // API 호출
    terms.value = response.map((term) => ({
      ...term,
      agreed: false, // 동의 상태 추가
      showContent: false, // 내용 표시 여부 추가
    }));
  } catch (error) {
    console.error('약관 데이터를 불러오는 중 오류 발생:', error);
  }
};

// 폼 제출 함수
const submitSignup = async () => {
  // 생년월일 형식 검증
  if (!isValidDateFormat(formData.value.birth)) {
    alert('생년월일은 "YYYY-MM-DD" 형식이어야 합니다.');
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    });

    // 서버 응답 상태 확인
    if (!response.ok) {
      throw new Error('서버 응답 오류: ' + response.status);
    }

    // 회원가입 성공 시 http://localhost:5173/user로 이동
    alert('가입이 완료되었습니다!');
    router.push('/user');
  } catch (error) {
    console.error('가입 중 오류 발생:', error);
    alert('가입 중 오류가 발생했습니다.');
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
