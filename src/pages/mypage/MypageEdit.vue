<template>
  <div class="mypage-edit-container">
    <!-- 상단 바 -->
    <header class="header">
      <button class="button" @click="GoBack">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <h2 class="title">일반회원 내 정보 수정</h2>
      <button class="logout-btn">로그아웃</button>
    </header>

    <!-- 입력 폼 -->
    <form @submit.prevent="handleSubmit">
      <div class="input_group">
        <label>한줄 소개</label>
        <input
          type="text"
          v-model="intro"
          class="input-field"
        />
      </div>

      <div class="input_group">
        <label>닉네임</label>
        <input
          type="text"
          v-model="nickname"
          class="input-field"
        />
      </div>

      <div class="input_group">
        <label>이름</label>
        <input
          type="text"
          v-model="name"
          class="input-field"
        />
      </div>

      <div class="input_group">
        <label>아이디</label>
        <input
          type="text"
          v-model="userId"
          class="input-field"
          disabled
        />
      </div>

      <div class="input_group">
        <label>비밀번호</label>
        <input
          type="password"
          v-model="password"
          class="input-field"
        />
      </div>

      <div class="input_group">
        <label>비밀번호 확인</label>
        <input
          type="password"
          v-model="confirmPassword"
          class="input-field"
        />
      </div>

      <div class="input_group">
        <label>이메일</label>
        <input
          type="email"
          v-model="email"
          class="input-field"
          disabled
        />
      </div>

      <div class="input_group">
        <label>성별</label>
        <input
          type="text"
          v-model="gender"
          class="input-field"
          disabled
        />
      </div>

      <div class="input_group">
        <label>생년월일</label>
        <input
          type="text"
          v-model="birthdate"
          class="input-field"
          disabled
        />
      </div>

      <button type="submit" class="submit-btn">
        변경하기
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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


const getUserExistingInfo = async () => {
  try {
    console.log('일반회원 기존정보 불러오는 API 호출 시작');
    const userExistingInfo = await MypageApi.getMyExistingInfo(); // 사용자의 정보를 가져오는 API 호출
    console.log(
      '일반회원 기존정보 불러오는 API 호출 성공:',
      userExistingInfo
    );

// 받아온 데이터를 변수에 저장
intro.value = userExistingInfo.userIntro;
nickname.value = userExistingInfo.userNickname;
    name.value = userExistingInfo.userName;
    loginId.value = userExistingInfo.userLoginId;
    email.value = userExistingInfo.userEmail;
    gender.value = userExistingInfo.userGender === 1 ? '남성' : '여성'; // 성별은 숫자로 올 가능성이 있으니 변환
    birth.value = userExistingInfo.userBirth2; // 포맷된 생일

  } catch (error) {
    console.error(
      '사용자 정보 가져오기 실패:',
      error
    );
  }
};

onMounted(() => {
  getUserExistingInfo();
});

</script>
<style></style>
