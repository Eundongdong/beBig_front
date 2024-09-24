<template>
  <div class="find_id_container">
    <header class="header-container">
      <button class="back" @click="goBack">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <p class="title">아이디 찾기</p>
    </header>

    <form @submit.prevent="findID">
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
        <label for="email">이메일</label>
        <input
          v-model="email"
          type="email"
          id="email"
          autocomplete="email"
          required
        />
      </div>

      <button type="submit">아이디 찾기</button>
    </form>

    <!-- 결과 표시 -->
    <div v-if="userID" class="result">
      <p>
        <strong>{{ name }}</strong> 님의 아이디는
        <strong class="highlight">{{
          userID
        }}</strong>
        입니다.
      </p>
    </div>
    <div v-else-if="errorMessage" class="error">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UserApi from '@/api/UserApi';
// import axios from 'axios'; // axios를 import

const name = ref(''); // 사용자 이름
const email = ref(''); // 사용자 이메일
const userID = ref(null); // 찾은 사용자 ID
const errorMessage = ref(''); // 오류 메시지

const findID = async () => {
  try {
    const response = await UserApi.findUserId({
      name: name.value,
      email: email.value,
    });
    userID.value = response; // 성공적으로 받은 아이디
    errorMessage.value = '';
  } catch (error) {
    console.error(
      'API 호출 중 오류 발생:',
      error
    );
    errorMessage.value =
      '해당 이름과 이메일로 등록된 아이디가 없습니다.';
    userID.value = null;
  }
};

// 뒤로가기 함수
const goBack = () => {
  window.history.back(); // 뒤로 가기
};
</script>

<style>
.find_id_container {
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

.highlight {
  color: #007bff;
}
</style>
