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
          <button
            class="button"
            @click="GoSignup"
          >
            회원가입
          </button>
          <button
            class="button"
            :disabled="disableSubmit"
            @click="login"
          >
            로그인
          </button>
          <button
            class="button"
            @click="GoSocialSignup"
          >
            소셜회원가입
          </button>
        </li>
        <li>
          <button
            class="button"
            @click="GoFindId"
          >
            아이디 찾기
          </button>
          <button
            class="button"
            @click="GoFindPwd"
          >
            비밀번호 찾기
          </button>
        </li>
      </ul>
    </div>
    <div class="Button">
      <ul>
        <li>
          <button
            class="naver_button"
            @click="naverSocialLogin"
          >
            네이버 로그인
          </button>
        </li>
        <li>
          <button
            class="kakao_button"
            @click="kakaoSocialLogin"
          >
            카카오 로그인
          </button>
        </li>
        <li>
          <button
            class="unsign_button"
            @click="unsignLogin"
          >
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

//////변수 선언
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

// id, password 입력 확인 => id, password 입력시 버튼 활성화
const disableSubmit = computed(
  () => !(loginUser.userId && loginUser.password)
);

//로그인
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

//가입없이 이용
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
  const REST_API_KEY = 'f8156e1595fd76d2b241ad4b4f3c4ca6';
  const REDIRECT_URI = 'http://localhost:8080/user/social-kakao';  // 백엔드의 redirect_uri

  // 카카오 로그인 페이지로 리디렉션
  window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
};

// 카카오 로그인 성공 후 소셜 회원가입 페이지로 이동
const GoSocialSignup = (user) => {
  router.push({
    path: '/user/social-signup',
    query: {
      name: user.name,
      email: user.email,
      gender: user.gender,
      nickname: user.nickname,
      userLoginType: user.userLoginType
    }
  });
};


// 네이버 소셜 로그인
const naverSocialLogin = () => {
  // 네이버 소셜 로그인 구현
};


/////라우터 이동
//회원가입 이동
const GoSignup = () => {
  router.push('./user/signup');
};
//아이디 찾기 이동
const GoFindId = () => {
  router.push('./user/findid');
};
//비밀번호 찾기 이동
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
