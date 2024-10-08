<template>
  <div class="lg:grid lg:grid-cols-3 lg:h-screen">
    <!-- 왼쪽 파란 배경 (웹에서만 적용) -->
    <div class="hidden lg:flex lg:bg-[#5354ff] lg:items-center lg:justify-center">
      <img src="/images/logo.png" class="w-[50%]" alt="Logo" />
    </div>

    <div class="flex justify-center items-start lg:col-span-2 lg:mt-32">
      <div class="container max-w-lg w-full px-6 ">
        <header class="flex justify-between items-center mb-3 relative">
          <button class="text-xl" @click="goBack">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <span class="font-bold text-base absolute left-1/2 transform -translate-x-1/2">아이디 찾기</span>
        </header>

        <form @submit.prevent="findID" class="container py-10">
          <!-- 이름 -->
          <div class="input_name">
            <label class="label" for="name">이름</label>
            <input class="input" v-model="name" type="text" id="name" autocomplete="name" required />
          </div>
          <!-- 이메일 -->
          <div class="input_email">
            <label class="label" for="email">이메일</label>
            <input class="input" v-model="email" type="email" id="email" autocomplete="email" required />
          </div>

          <button class="button !mt-6" type="submit">아이디 찾기</button>
        </form>

        <!-- 결과 표시 -->
        <div v-if="userLoginId" class="result text-center text-lg mt-10">
          <p>
            <span class="big-text">{{ name }}</span> 님의 아이디는
            <br />
            <span class="big-text">{{ userLoginId }}</span> 입니다.
          </p>
        </div>
        <div v-else-if="errorMessage" class="result_error text-center text-lg mt-10">
          <p>{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import UserApi from '@/api/UserApi';

const router = useRouter();

const name = ref(''); // 사용자 이름
const email = ref(''); // 사용자 이메일
const userLoginId = ref(null); // 찾은 사용자 ID
const errorMessage = ref(''); // 오류 메시지

const findID = async () => {
  try {
    const response = await UserApi.findUserId({
      name: name.value,
      email: email.value,
    });
    userLoginId.value = response; // 성공적으로 받은 아이디
    errorMessage.value = '';
  } catch (error) {
    //console.error("API 호출 중 오류 발생:", error);
    errorMessage.value = '해당 이름과 이메일로 등록된 아이디가 없습니다.';
    userLoginId.value = null;
  }
};

// 뒤로가기 함수
const goBack = () => {
  router.push({ name: 'user' });
};
</script>

<style>
/* 최소 높이로 폼과 결과 공간 확보 */
.container {
  min-height: 300px; /* 필요에 따라 값 조정 가능 */
}
</style>