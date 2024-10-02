<template>
  <div class="mypage-edit-container">
    <!-- 상단 바 -->
    <header class="header">
      <button class="" @click="goBack">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <h2 class="">일반회원 내 정보 수정</h2>
      <button class="logout-btn" @click="logout">로그아웃</button>
    </header>

    <!-- 입력 폼 -->
    <form @submit.prevent="handleSubmit">
      <div class="input_group">
        <label>한줄 소개</label>
        <input type="text" v-model="intro" class="input-field" />
      </div>

      <div class="input_group">
        <label>닉네임</label>
        <input type="text" v-model="nickname" class="input-field" />
      </div>

      <div class="input_group">
        <label>이름</label>
        <input type="text" v-model="name" class="input-field" disabled />
      </div>

      <div class="input_group">
        <label>아이디</label>
        <input type="text" v-model="loginId" class="input-field" disabled />
      </div>

      <div class="input_group">
        <label>비밀번호</label>
        <input type="password" v-model="password" class="input-field" />
      </div>

      <div class="input_group">
        <label>비밀번호 확인</label>
        <input type="password" v-model="confirmPassword" class="input-field" />
      </div>

      <div class="input_group">
        <label>이메일</label>
        <input type="email" v-model="email" class="input-field" disabled />
      </div>

      <div class="input_group">
        <label>성별</label>
        <input type="text" v-model="gender" class="input-field" disabled />
      </div>

      <div class="input_group">
        <label>생년월일</label>
        <input type="text" v-model="birth" class="input-field" disabled />
      </div>

      <button type="submit" class="submit-btn">수정하기</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import MypageApi from '@/api/MypageApi';

// 데이터 저장 변수
const intro = ref('');
const nickname = ref('');
const name = ref('');
const loginId = ref('');
const password = ref(''); // 비밀번호 필드 추가
const confirmPassword = ref(''); // 비밀번호 확인 필드 추가
const email = ref('');
const gender = ref('');
const birth = ref('');

const router = useRouter(); // router 사용을 위한 선언
const userStore = useUserStore(); // userStore 사용을 위한 선언

// 이전 페이지(Mypage.vue)로 이동하는 함수
const goBack = () => {
  router.push({ name: 'mypage' }); // mypage로 이동
};

// 로그아웃 함수 추가
const logout = () => {
  userStore.logout(); // 로그아웃 처리
  router.push('/'); // 홈으로 이동
};

// 기존 정보 불러오는 함수
const getUserExistingInfo = async () => {
  try {
    console.log('회원 기존정보 불러오는 API 호출 시작');
    const userExistingInfo = await MypageApi.getMyExistingInfo(); // 사용자의 정보를 가져오는 API 호출
    console.log('회원 기존정보 불러오는 API 호출 성공:', userExistingInfo);

    // 받아온 데이터를 변수에 저장
    intro.value = userExistingInfo.userIntro;
    nickname.value = userExistingInfo.userNickname;
    name.value = userExistingInfo.userName;
    loginId.value = userExistingInfo.userLoginId;
    email.value = userExistingInfo.userEmail;
    gender.value = userExistingInfo.userGender === 1 ? '여성' : '남성'; // 성별은 숫자로 올 가능성이 있으니 변환
    birth.value = userExistingInfo.userBirth2; // 포맷된 생일
  } catch (error) {
    console.error('회원 기존정보 가져오기 실패:', error);
  }
};

// 수정한 정보 백엔드로 전송하는 함수
const handleSubmit = async () => {
  try {
    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (password.value !== confirmPassword.value) {
      alert('비밀번호가 일치하지 않습니다.');

      // 비밀번호와 비밀번호 확인 필드 초기화
      password.value = '';
      confirmPassword.value = '';
      return;
    }

    // 수정된 정보 전송
    const userData = {
      user_intro: intro.value,
      user_nickname: nickname.value,
      user_password: password.value, // 일반 회원의 경우 비밀번호도 전송
      user_login_type: 'general', // 일반 로그인으로 설정
    };

    const response = await MypageApi.edit(userData); // 백엔드로 정보 전송
    console.log('프로필 수정 완료:', response);

    alert('프로필이 성공적으로 수정되었습니다.');
    router.push({ name: 'mypage' }); // 성공 후 mypage로 이동
  } catch (error) {
    console.error('프로필 수정 실패:', error);
    alert('프로필 수정에 실패했습니다.');
  }
};

onMounted(() => {
  getUserExistingInfo();
});
</script>
<style></style>
