<template>
    <div class="container">
      <h1>{{ selectedBank }}은행을 선택하셨군요.</h1>
      <h3>아이디</h3>
      <input type="text" v-model="bankAccount.Id" placeholder="Enter your ID" class="input-field"/>
      <h3>비밀번호</h3>
      <input type="password" v-model="bankAccount.pwd" placeholder="Enter your password" class="input-field"/>
      <h3 class="count-text">아이디/비밀번호 입력 횟수가 {{ count }}번 남았습니다.</h3>
      <button @click="Connect" class="primary-button">계좌 연결하기</button>
    </div>
  
    <!-- 계좌 목록을 보여주는 섹션 -->
    <div class="account-list">
      <div v-for="(account, index) in accountList" :key="index" class="account-info">
        <img :src="`../../../public/images/bank/${account.bankName}.png`" alt="Bank Logo" class="bank-logo">
        <div class="account-details">
          <p>{{ account.bankName }}은행</p>
          <p>통장이름: {{ account.accountName }}</p>
          <p>계좌번호: {{ account.accountNumber }}</p>
          <p>잔액: {{ account.balance }}</p>
        </div>
      </div>
      <button @click="addAccount" class="primary-button">계좌를 추가하시겠습니까?</button>
    </div>
  
  </template>
  
  <script setup>
    import { useBankStore } from '@/stores/bank'; // Pinia 스토어 가져오기
    import { ref, reactive, computed } from 'vue';
    import { useRouter } from 'vue-router';
    
    const bankStore = useBankStore(); // Pinia 스토어 사용
  
    const bankAccount = reactive({
      Id: '',
      pwd: ''
    });
    
    const count = ref(3);  // 남은 횟수
    
    // Pinia에서 선택된 은행 이름을 가져옴
    const selectedBank = computed(() => bankStore.selectedBank);
  
    // 예시 계좌 목록
    const accountList = ref([
      {
        bankName: '신한',
        accountName: '생활비',
        accountNumber: '110-1234-5678',
        balance: '1,234,000원'
      },
      {
        bankName: 'KB국민',
        accountName: '저축예금',
        accountNumber: '123-4567-8910',
        balance: '5,678,000원'
      }
    ]);
  
    // "계좌 연결하기" 버튼 클릭 시 호출될 함수
    const Connect = () => {
      console.log("계좌 연결 시도");
    };
  
    // "계좌를 추가하시겠습니까?" 버튼 클릭 시 호출될 함수
    const addAccount = () => {
      console.log("계좌 추가 시도");
    };
  </script>
  
  <style scoped>
    .container {
      background-color: #f3f3f3;
      padding: 20px;
      border-radius: 15px;
      text-align: center;
    }
  
    h1 {
      font-size: 24px;
      font-weight: bold;
      color: black;
    }
  
    .input-field {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border-radius: 5px;
      border: 1px solid #ccc;
    }
  
    .count-text {
      color: red;
    }
  
    .primary-button {
      background-color: #3F40FF;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      cursor: pointer;
      margin-top: 10px;
      width: 100%;
    }
  
    .account-list {
      margin-top: 20px;
      padding: 10px;
      background-color: #f3f3f3;
      border-radius: 15px;
    }
  
    .account-info {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
  
    .bank-logo {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
  
    .account-details {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  
    .account-details p {
      margin: 0;
      font-size: 14px;
      color: black;
    }
  </style>
  