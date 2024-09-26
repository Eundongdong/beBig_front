<template>
  <div class="find_pwd_container">
    <header class="header-container">
      <button class="back" @click="goBack">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <p class="title">비밀번호 찾기</p>
    </header>

    <form @submit.prevent="findPassword">
      <div>
        <label for="name">이름</label>
        <input
          v-model="name"
          type="text"
          id="name"
          autocomplete="name"
          required
        />
      </div>
      <div>
        <label for="userLoginId">아이디</label>
        <input
          v-model="userLoginId"
          type="text"
          id="userLoginId"
          autocomplete="username"
          required
        />
      </div>
      <div>
        <label for="email">이메일</label>
        <input
          v-model="email"
          type="email"
          id="email"
          autocomplete="email"
          required
        />
      </div>

      <button type="submit">비밀번호 찾기</button>
    </form>

    <!-- 결과 표시 -->
    <div v-if="message" class="result">
      <p>{{ message }}</p>
    </div>
    <div v-else-if="errorMessage" class="error">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UserApi from '@/api/UserApi'; // 실제 API 모듈 경로 확인

const name = ref(''); // 사용자 이름
const userLoginId = ref(''); // 사용자 아이디
const email = ref(''); // 사용자 이메일
const message = ref(null); // 성공 메시지
const errorMessage = ref(null); // 오류 메시지

const findPassword = async () => {
  try {
    const response = await UserApi.findUserPwd({
      name: name.value,
      userLoginId: userLoginId.value,
      email: email.value,
    });

    name.value = '';
    userLoginId.value = '';
    email.value = '';

    message.value = '임시 비밀번호를 입력하신 이메일로 보냈어요!';
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    if (error.response && error.response.status === 404) {
      errorMessage.value = '해당 정보로 등록된 계정을 찾을 수 없습니다.';
    } else {
      errorMessage.value = '서버와 통신 중 오류가 발생했습니다.';
    }
    message.value = null;
  }
};

const goBack = () => {
  window.history.back(); // 뒤로 가기
};
</script>

<style>
.find_pwd_container {
  text-align: center;
  padding: 20px;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.title {
  flex: 1;
  text-align: center;
  margin-right: 24px; /* 아이콘 크기에 맞게 여백을 추가 */
}

.back {
  background: none;
  border: none;
  font-size: 24px;
}

.result,
.error {
  margin-top: 20px;
}

.error {
  color: red;
}

.result {
  color: #007bff;
  font-weight: bold;
}
</style>
