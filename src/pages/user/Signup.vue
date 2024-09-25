<template>
  <div class="Page">
    <div class="Logo">
      <ul>
        <li>
          <button class="button" @click="GoBack"><</button>
          <h1>일반 회원가입</h1>
        </li>
      </ul>
    </div>
    <div class="Input1">
      <ul>
        <li>
          <h3>이름</h3>
          <input
            type="text"
            v-model="User.name"
            placeholder="Enter your Name"
          />
        </li>
        <li>
          <h3>아이디</h3>
          <input
            type="text"
            v-model="User.userId"
            placeholder="Enter your ID"
            @change="idDupCheckAPI"
          />
          <h4 v-if="idDupCheckResult">다른 아이디를 입력해주세요</h4>
        </li>
        <li>
          <h3>비밀번호</h3>
          <input
            type="password"
            v-model="User.password"
            placeholder="Enter your password"
          />
        </li>
        <li>
          <h3>비밀번호 확인</h3>
          <h4 v-if="pwdChecking">비밀번호가 다릅니다.</h4>
          <input
            type="password"
            v-model="checkPassword"
            placeholder="Enter your password again"
          />
        </li>
      </ul>
    </div>
    <div class="Input2">
      <ul>
        <li>
          <h3>닉네임</h3>
          <input
            type="text"
            v-model="User.nickname"
            placeholder="Enter your NickName"
          />
        </li>
        <li>
          <h3>이메일</h3>
          <input
            type="text"
            v-model="User.email"
            placeholder="Enter your Email"
          />
        </li>
        <li>
          <h3>성별</h3>
          <label>
            <input type="radio" v-model="User.gender" value="false" /> 남성
          </label>
          <label>
            <input type="radio" v-model="User.gender" value="true" /> 여성
          </label>
        </li>
        <li>
          <h3>생년월일</h3>
          <div class="birth-selection">
            <select v-model="year">
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>
            년
            <select v-model="month">
              <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
            </select>
            월
            <select v-model="day">
              <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
            </select>
            일
          </div>
        </li>
      </ul>
    </div>
    <div class="Policy">
      <ul>
        <li>
          <h5>전체동의</h5>
          <label class="slider">
            <input type="checkbox" v-model="allAgree" @change="toggleAll" />
            <span class="slider-knob"></span>
          </label>
        </li>
      </ul>
      <ul>
        <li>
          <h2>개인정보 이용 동의</h2>
          <h5>동의</h5>
          <label class="slider">
            <input type="checkbox" v-model="personalAgree" />
            <span class="slider-knob"></span>
          </label>

          <button @click="toggleShowPersonalTerms">
            {{ showPersonalTerms ? '▲' : '▼' }}
          </button>
          <div v-if="showPersonalTerms">
            <p>{{ getPersonalTerms() }}</p>
          </div>
        </li>
      </ul>
      <ul>
        <li>
          <h2>금융정보 이용 동의</h2>
          <h5>동의</h5>
          <label class="slider">
            <input type="checkbox" v-model="financialAgree" />
            <span class="slider-knob"></span>
          </label>

          <button @click="toggleShowFinancialTerms">
            {{ showFinancialTerms ? '▲' : '▼' }}
          </button>
          <div v-if="showFinancialTerms">
            <p>{{ getFinancialTerms() }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="Button">
      <button class="signup_button" @click="signup" :disabled="!allAgree">
        가입하기
      </button>
    </div>
  </div>
</template>

<script setup>
import UserApi from '@/api/UserApi';
import { ref, reactive, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

//////변수 선언
const router = useRouter();
const route = useRoute();

const User = reactive({
  name: '',
  nickname: '',
  userId: '',
  password: '',
  email: '',
  gender: '',
  birth: '',
});

const year = ref('');
const month = ref('');
const day = ref('');

//아이디 비번 중복 체크 변수
const idDupCheckResult = ref(false);
const checkPassword = ref('');

// 토글 상태
const allAgree = ref(false);
const personalAgree = ref(false);
const financialAgree = ref(false);

// 약관 보기 상태
const showPersonalTerms = ref(false);
const showFinancialTerms = ref(false);

// 약관 내용을 저장할 변수
const personalTermsContent = ref(''); // 개인정보 약관 내용 저장
const financialTermsContent = ref(''); // 금융정보 약관 내용 저장

// 전체 동의 시, 하위 항목도 변경
const toggleAll = () => {
  personalAgree.value = allAgree.value;
  financialAgree.value = allAgree.value;
};
// 모든 약관 동의 상태 업데이트
watch([personalAgree, financialAgree], () => {
  allAgree.value = personalAgree.value && financialAgree.value;
});

// 약관 내용 보이기/숨기기
const toggleShowPersonalTerms = () => {
  showPersonalTerms.value = !showPersonalTerms.value;
};
const toggleShowFinancialTerms = () => {
  showFinancialTerms.value = !showFinancialTerms.value;
};

//비밀번호 체크
const pwdChecking = computed(() => {
  return (
    User.password !== checkPassword.value && checkPassword.value.length > 0
  );
});

//ID 중복체크
const idDupCheckAPI = async () => {
  try {
    const idDupCheck = await UserApi.idDuplicateCheck(User.userId);
    console.log('아이디 중복 체크 성공:', idDupCheck);
    idDupCheckResult.value = idDupCheck === true;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
  }
};

//생년월일 받아오기
// 연도 범위 (1900년부터 현재까지)
const years = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i);
});

// 월 선택 (01~12월)
const months = computed(() => {
  return Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
});

// 일 선택 (01~31일)
const days = computed(() => {
  return Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
});

// 비밀번호 확인 체크
const pwdCheck = computed(() => loginUser.password !== checkPassword.value);

// 생년월일 자동 업데이트
watch([year, month, day], () => {
  if (year.value && month.value && day.value) {
    User.birth = `${year.value}-${month.value}-${day.value}`;
  }
});

//약관 불러오기
const getPersonalTerms = async () => {
  try {
    const response = await UserApi.getPolicy();
    personalTermsContent.value = response.data.personalTerms;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
  }
};
const getFinancialTerms = async () => {
  try {
    const response = await UserApi.getPolicy();
    financialTermsContent.value = response.data.financialTerms;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
  }
};

//회원가입
const signup = async () => {
  console.log(User);
  try {
    const response = await UserApi.signup(User);
    //console.log(response);
    router.push('/user');
  } catch (error) {
    console.log('에러 =>', error);
  }
};

//뒤로가기
const GoBack = () => {
  router.push('/user');
};
</script>

<style scoped>
ul {
  list-style-type: none;
}

/* 스위치 슬라이더 스타일 */
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
