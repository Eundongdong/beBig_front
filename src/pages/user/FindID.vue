<template>
  <div class="page">
    <header class="header">
      <button class="back-button" @click="goBack">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
    </header>

    <form @submit.prevent="findID" class="container">
      <!-- 이름 -->
      <div class="input_name">
        <label class="label" for="name">이름</label>
        <input
          class="input"
          v-model="name"
          type="text"
          id="name"
          autocomplete="name"
          required
        />
      </div>
      <!-- 이메일 -->
      <div class="input_email">
        <label class="label" for="email">이메일</label>
        <input
          class="input"
          v-model="email"
          type="email"
          id="email"
          autocomplete="email"
          required
        />
      </div>

      <button class="button" type="submit">아이디 찾기</button>
    </form>

    <!-- 결과 표시 -->
    <div v-if="userLoginId" class="result text-center text-lg mt-10">
      <p>
        <span class="big-text">{{ name }}</span> 님의 아이디는
        <br />
        <span class="big-text">{{ userLoginId }}</span> 입니다.
      </p>
    </div>
    <div
      v-else-if="errorMessage"
      class="result_error text-center text-lg mt-10"
    >
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserApi from "@/api/UserApi";

const router = useRouter();

const name = ref(""); // 사용자 이름
const email = ref(""); // 사용자 이메일
const userLoginId = ref(null); // 찾은 사용자 ID
const errorMessage = ref(""); // 오류 메시지

const findID = async () => {
  try {
    const response = await UserApi.findUserId({
      name: name.value,
      email: email.value,
    });
    userLoginId.value = response; // 성공적으로 받은 아이디
    errorMessage.value = "";
  } catch (error) {
    //console.error("API 호출 중 오류 발생:", error);
    errorMessage.value = "해당 이름과 이메일로 등록된 아이디가 없습니다.";
    userLoginId.value = null;
  }
};

// 뒤로가기 함수
const goBack = () => {
  router.push({ name: "user" });
};
</script>
