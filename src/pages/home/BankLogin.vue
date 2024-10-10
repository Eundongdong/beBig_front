BankLogin.vue

<template>
  <div class="page">
    <header class="w-full flex justify-between items-center mb-6 px-2 relative">
      <button class="text-lg" @click="handleBackClick">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <p class="font-bold text-base absolute left-1/2 transform -translate-x-1/2">계좌 연결하기</p>
    </header>

    <div class="section-style mx-4 lg:mx-20 lg:pt-4">
      <p class="text-base font-bold text-center mt-2">{{ selectedBank }} 계좌 연결</p>
      <div class="mt-8 mx-6">
        <div>
          <p class="label">아이디</p>
          <input type="text" v-model="bankAccount.userBankId" placeholder="은행 아이디를 입력하세요" class="input" />
        </div>
        <div>
          <p class="label">비밀번호</p>
          <input
            type="password"
            v-model="bankAccount.bankPassword"
            placeholder="은행 비밀번호를 입력하세요."
            class="input"
          />
        </div>

        <p v-if="checkCount" class="text-red-500 text-sm">아이디/비밀번호 입력 횟수가 {{ count }}번 남았습니다.</p>
        <button @click="Connect" class="button !mt-6">계좌 연결하기</button>
      </div>
    </div>

    <!-- 계좌 목록을 보여주는 섹션 -->
    <div v-if="accountList.length != 0" class="flex mt-8 mx-4 lg:mx-20">
      <div v-for="account in accountList" :key="account.resAccount" class="flex items-center justify-between mb-4 bg-white
      p-4 rounded-lg shadow" >
      <div class="flex items-center">
        <img :src="`/images/bank/${account.bankVo.bankName}.png`" alt="Bank Logo" class="bank-icon" />
        <div class="ml-4">
          <p class="font-bold text-base">{{ account.bankVo.bankName }}</p>
          <p class="text-sm">통장이름 : {{ account.resAccountName }}</p>
          <p class="text-sm">계좌번호 : {{ account.resAccount }}</p>
          <p class="text-sm">잔액 : {{ account.resAccountBalance.toLocaleString() }} 원</p>
        </div>
      </div>
      <div class="flex items-center">
        <button @click="addAccount()" class="button ml-auto">계좌 추가</button>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { useBankStore } from '@/stores/bank'; // Pinia 스토어 가져오기
import HomeApi from '@/api/HomeApi';
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const bankStore = useBankStore(); // Pinia 스토어 사용

const bankAccount = reactive({
  bank: '',
  userBankId: '',
  bankPassword: '',
});
const count = ref(3); // 남은 횟수
const checkCount = ref(false);

// Pinia에서 선택된 은행 이름을 가져옴
const selectedBank = computed(() => bankStore.selectedBank);
bankAccount.bank = bankStore.getSelectedBankNum();

// 예시 계좌 목록
const accountList = reactive([]);

// "계좌 연결하기" 버튼 클릭 시 호출될 함수
const Connect = async () => {
  try {
    const response = await HomeApi.getAccountList(bankAccount);
    for (let i = 0; i < response.length; i++) {
      accountList[i] = response[i];
    }
    checkCount.value = false;
    //  console.log(accountList);
  } catch (error) {
    //여기서 error 코드에 따라 남은 횟수 수정하기
    console.error('API 호출 중 오류 발생:', error);
    console.log(error.response.data);
    if (error.response.data == '아이디/비밀번호를 확인하세요.') {
      if (count.value == 1) {
        alert('은행 홈페이지에 방문하여 아이디/비밀번호를 확인하시기 바랍니다.');
        router.push('/home');
      } else {
        alert(error.response.data);
        checkCount.value = true;
        count.value = count.value - 1;
      }
    } else {
      alert(error.response.data);
      router.push('/home/bank');
    }
  }
};

// "계좌를 추가하시겠습니까?" 버튼 클릭 시 호출될 함수
const addAccount = async () => {
  console.log('계좌 추가 시도');
  try {
    const response = await HomeApi.addAccount(accountList);
    router.push('/home');
  } catch (error) {
    //  console.error('API 호출 중 오류 발생:', error);
  }
};

// 뒤로가기 버튼 클릭 시 실행되는 함수
const handleBackClick = () => {
  router.push('/home/bank');
};
</script>
