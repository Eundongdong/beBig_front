<template>
  <div class="page">
    <div class="flex justify-center mb-8">
      <img src="/images/logo.png" class="w-[45%]" alt="Logo" />
    </div>
    <div class="container">
      <div class="input_id">
        <label for="id" class="label">아이디</label>
        <input
          type="text"
          class="input"
          v-model="loginUser.userLoginId"
          placeholder="아이디를 입력하세요"
          id="id"
        />
      </div>

      <div class="input_password">
        <label for="password" class="label">비밀번호</label>
        <input
          type="password"
          class="input"
          v-model="loginUser.password"
          placeholder="비밀번호를 입력하세요"
          id="password"
        />
      </div>

      <div class="flex justify-between space-x-2">
        <button class="button" @click="GoSignup">회원가입</button>
        <button class="button" :disabled="disableSubmit" @click="login">
          로그인
        </button>
      </div>
      <div class="flex justify-center items-center space-x-2">
        <button class="text-button" @click="GoFindId">아이디 찾기</button>
        <button class="text-button" @click="GoFindPwd">비밀번호 찾기</button>
      </div>

      <div class="space-y-4 mt-6">
        <ul>
          <li>
            <button
              class="white-button flex justify-center items-center space-x-2"
              @click="naverSocialLogin"
            >
              <img src="/images/naver.png" class="w-[40px]" />
              <span>네이버 로그인</span>
            </button>
          </li>
          <li>
            <button
              class="white-button flex justify-center items-center space-x-2"
              @click="kakaoSocialLogin"
            >
              <img src="/images/kakao.png" class="w-[40px]" />
              <span>카카오 로그인</span>
            </button>
          </li>
          <li>
            <button class="button my-10" @click="unsignLogin">
              가입없이 이용하기
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

////// 변수 선언
const router = useRouter();
const userStore = useUserStore();

const loginUser = reactive({
  userLoginId: "",
  password: "",
});

const noLogin = reactive({
  userLoginId: "NoLogin",
  password: "1234",
});

// id, password 입력 확인 => id, password 입력 시 버튼 활성화
const disableSubmit = computed(
  () => !(loginUser.userLoginId && loginUser.password)
);

// 로그인
const login = async () => {
  console.log(loginUser);
  try {
    await userStore.login(loginUser);
    router.push("/home");
  } catch (error) {
    console.log("에러 =>", error.message); // 에러 로그 출력
    alert(error.message); // 경고창으로 에러 메시지 표시
  }
};

// 가입 없이 이용
const unsignLogin = async () => {
  try {
    await userStore.login(noLogin);
    router.push("/home");
  } catch (error) {
    console.log("에러 =>", error);
  }
};

// 카카오 소셜 로그인
const kakaoSocialLogin = () => {
  const REST_API_KEY = "f8156e1595fd76d2b241ad4b4f3c4ca6"; // 카카오 REST API 키
  const REDIRECT_URI = "http://localhost:5173/user"; // 카카오 리다이렉트 URI
  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login`;

  // 카카오 로그인 URL로 리다이렉트
  window.location.href = kakaoLoginUrl;
};

// 카카오 로그인 인가 코드 처리
const handleKakaoLogin = async () => {
  // URL에서 인가 코드 추출
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code"); // 인가 코드 가져오기

  if (code) {
    try {
      // 서버로 인가 코드를 전송하여 액세스 토큰 및 사용자 정보 가져오기
      const response = await fetch(
        `http://localhost:8080/user/social-kakao?code=${code}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 응답 상태 확인
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();

      console.log("카카오 로그인 사용자 정보:", data);

      if (data.existingUser === false) {
        // 소셜 회원가입 페이지로 이동하면서 user 데이터를 전달
        GoSocialSignup(data.user);
      } else if (data.existingUser === true) {
        // token을 저장하고 홈 화면으로 이동
        handleSuccessfulLogin(data);
      }
    } catch (error) {
      console.error("카카오 로그인 처리 중 오류:", error);
      alert(`로그인 처리 중 오류가 발생했습니다: ${error.message}`);
    }
  } else {
    console.error("카카오 인가 코드가 URL에 없습니다.");
  }
};

// 로그인 성공 시 토큰을 저장하고 홈 화면으로 이동하는 함수
const handleSuccessfulLogin = async (data) => {
  // 토큰을 localStorage에 저장
  //localStorage.setItem('authToken', token);
  try {
    userStore.socialLigin(data);
    // 홈 화면으로 이동
    router.push("/home");
  } catch (error) {
    console.log(error);
  }
};

// 페이지 로드 시 인가 코드가 있는지 확인
if (window.location.search.includes("code=")) {
  handleKakaoLogin();
}

// 데이터를 주소창에 보이지 않게 하기 위해 localStorage 사용
const GoSocialSignup = (user) => {
  // user 정보를 localStorage에 저장
  localStorage.setItem("socialUser", JSON.stringify(user));

  // 소셜 회원가입 페이지로 이동
  router.push("/user/social-signup");
};

// 소셜 회원가입 페이지에서 localStorage에서 데이터 읽기
const loadUserFromStorage = () => {
  const userData = localStorage.getItem("socialUser");
  if (userData) {
    return JSON.parse(userData); // JSON을 객체로 변환
  }
  return null;
};

// 페이지 로드 시 localStorage에서 데이터 로드
const user = loadUserFromStorage();
console.log("로드된 사용자 정보:", user);

// 네이버 소셜 로그인
const naverSocialLogin = () => {
  // 네이버 소셜 로그인 구현
};

///// 라우터 이동
// 회원가입 이동
const GoSignup = () => {
  router.push("./user/signup");
};
// 아이디 찾기 이동
const GoFindId = () => {
  router.push("./user/findid");
};
// 비밀번호 찾기 이동
const GoFindPwd = () => {
  router.push("./user/findpwd");
};
</script>
