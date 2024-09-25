<template>
  <div class="Page">
    <div class="Logo">
      <h1>beBIG</h1>
    </div>
    <div class="Input">
      <ul>
        <li>
          <h3>아이디</h3>
          <input
            type="text"
            v-model="loginUser.userId"
            placeholder="Enter your ID"
          />
        </li>
        <li>
          <h3>비밀번호</h3>
          <input
            type="password"
            v-model="loginUser.password"
            placeholder="Enter your password"
          />
        </li>
        <li>
          <button class="button" @click="GoSignup">회원가입</button>
          <button class="button" :disabled="disableSubmit" @click="login">
            로그인
          </button>
          <button class="button" @click="GoSocialSignup">소셜회원가입</button>
        </li>
        <li>
          <button class="button" @click="GoFindId">아이디 찾기</button>
          <button class="button" @click="GoFindPwd">비밀번호 찾기</button>
        </li>
      </ul>
    </div>
    <div class="Button">
      <ul>
        <li>
          <button class="naver_button" @click="naverSocialLogin">
            네이버 로그인
          </button>
        </li>
        <li>
          <button class="kakao_button" @click="kakaoSocialLogin">
            카카오 로그인
          </button>
        </li>
        <li>
          <button class="unsign_button" @click="unsignLogin">
            가입없이 이용
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

////// 변수 선언
const router = useRouter();
const userStore = useUserStore();

const loginUser = reactive({
  userId: '',
  password: '',
});

const noLogin = reactive({
  userId: 'test',
  password: '0000',
});

// id, password 입력 확인 => id, password 입력 시 버튼 활성화
const disableSubmit = computed(() => !(loginUser.userId && loginUser.password));

// 로그인
const login = async () => {
  console.log(loginUser);
  try {
    await userStore.login(loginUser);
    router.push('/home');
  } catch (error) {
    console.log('에러 =>', error.message); // 에러 로그 출력
    alert(error.message); // 경고창으로 에러 메시지 표시
  }
};

// 가입 없이 이용
const unsignLogin = async () => {
  console.log(loginUser);
  try {
    await userStore.login(noLogin);
  } catch (error) {
    console.log('에러 =>', error);
  }
};

// 카카오 소셜 로그인
const kakaoSocialLogin = () => {
  const REST_API_KEY = 'f8156e1595fd76d2b241ad4b4f3c4ca6'; // 카카오 REST API 키
  const REDIRECT_URI = 'http://localhost:5173/user'; // 카카오 리다이렉트 URI
  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  // 카카오 로그인 URL로 리다이렉트
  window.location.href = kakaoLoginUrl;
};

// 카카오 로그인 인가 코드 처리
const handleKakaoLogin = async () => {
  // URL에서 인가 코드 추출
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code'); // 인가 코드 가져오기

  if (code) {
    try {
      // 서버로 인가 코드를 전송하여 액세스 토큰 및 사용자 정보 가져오기
      const response = await fetch(
        `http://localhost:8080/user/social-kakao?code=${code}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // 응답 상태 확인
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();

      console.log('카카오 로그인 사용자 정보:', data);

      if (data.existingUser === false) {
        // 소셜 회원가입 페이지로 이동하면서 user 데이터를 전달
        GoSocialSignup(data.user);
      } else if (data.existingUser === true) {
        // token을 저장하고 홈 화면으로 이동
        handleSuccessfulLogin(data.token);
      }
    } catch (error) {
      console.error('카카오 로그인 처리 중 오류:', error);
      alert(`로그인 처리 중 오류가 발생했습니다: ${error.message}`);
    }
  } else {
    console.error('카카오 인가 코드가 URL에 없습니다.');
  }
};

// 로그인 성공 시 토큰을 저장하고 홈 화면으로 이동하는 함수
const handleSuccessfulLogin = (token) => {
  // 토큰을 localStorage에 저장
  localStorage.setItem('authToken', token);

  // 홈 화면으로 이동
  router.push('/home');
};

// 페이지 로드 시 인가 코드가 있는지 확인
if (window.location.search.includes('code=')) {
  handleKakaoLogin();
}

// 데이터를 주소창에 보이지 않게 하기 위해 localStorage 사용
const GoSocialSignup = (user) => {
  // user 정보를 localStorage에 저장
  localStorage.setItem('socialUser', JSON.stringify(user));

  // 소셜 회원가입 페이지로 이동
  router.push('/user/social-signup');
};

// 소셜 회원가입 페이지에서 localStorage에서 데이터 읽기
const loadUserFromStorage = () => {
  const userData = localStorage.getItem('socialUser');
  if (userData) {
    return JSON.parse(userData); // JSON을 객체로 변환
  }
  return null;
};

// 페이지 로드 시 localStorage에서 데이터 로드
const user = loadUserFromStorage();
console.log('로드된 사용자 정보:', user);

// 네이버 소셜 로그인
const naverSocialLogin = () => {
  // 네이버 소셜 로그인 구현
};

///// 라우터 이동
// 회원가입 이동
const GoSignup = () => {
  router.push('./user/signup');
};
// 아이디 찾기 이동
const GoFindId = () => {
  router.push('./user/findid');
};
// 비밀번호 찾기 이동
const GoFindPwd = () => {
  router.push('./user/findpwd');
};
</script>

<style scoped>
.Page {
  width: 100%;
  min-width: 340px; /*스마트폰 기준 너비 */
  margin: 0 auto;
  padding: 20px;
}

ul {
  list-style-type: none;
}
</style>
