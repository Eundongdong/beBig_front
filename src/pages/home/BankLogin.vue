<template>
  <div class="page">
    <button @click="handleBackClick" class="back-button">&lt;</button>
    <div class="container">
      <h1>{{ selectedBank }}을 선택하셨군요.</h1>
      <h3>아이디</h3>
      <input type="text" v-model="bankAccount.userBankId" placeholder="Enter your ID" class="input-field"/>
      <h3>비밀번호</h3>
      <input type="password" v-model="bankAccount.bankPassword" placeholder="Enter your password" class="input-field"/>
      <h3 class="count-text">아이디/비밀번호 입력 횟수가 {{ count }}번 남았습니다.</h3>
      <button @click="Connect" class="primary-button">계좌 연결하기</button>
    </div>
  
    <!-- 계좌 목록을 보여주는 섹션 -->
    <div v-if="accountList.length != 0" class="account-list">
      <div v-for="account in accountList" :key="accountList.resAccount" class="account-info">
        <img :src="`../../../public/images/bank/${account.bankVo.bankName}.png`" alt="Bank Logo" class="bank-logo">

        <div class="account-details">
          <p>{{ account.bankVo.bankName }}</p>
          <p>통장이름: {{ account.resAccountName }}</p>
          <p>계좌번호: {{ account.resAccount}}</p>
          <p>잔액: {{ account.resAccountBalance}}</p>
        </div>
      </div>
      <button @click="addAccount()" class="primary-button">계좌를 추가하시겠습니까?</button>
    </div>
  </div>
  </template>
  
  <script setup>
    import { useBankStore } from '@/stores/bank'; // Pinia 스토어 가져오기
    import HomeApi from '@/api/HomeApi';
    import { ref, reactive, computed} from 'vue';
    import { useRouter } from 'vue-router';
    const router = useRouter();
    
    const bankStore = useBankStore(); // Pinia 스토어 사용
  
    const bankAccount = reactive({
      bank: '',
      userBankId: '',
      bankPassword: ''
    });
    const count = ref(3);  // 남은 횟수
    
    // Pinia에서 선택된 은행 이름을 가져옴
    const selectedBank = computed(() => bankStore.selectedBank);
    bankAccount.bank = bankStore.getSelectedBankNum();

    // 예시 계좌 목록
    const accountList = reactive([]);
  
    // "계좌 연결하기" 버튼 클릭 시 호출될 함수
    const Connect = async() => {
      console.log("계좌 연결 시도");
      try{
        const response = await HomeApi.getAccountList(bankAccount);
        for(let i=0;i<response.length;i++){
          accountList[i] = response[i];
        }
        console.log(accountList);
      }catch(error){
        //여기서 error 코드에 따라 남은 횟수 수정하기
        console.error('API 호출 중 오류 발생:', error);
      }
    };

  
    // "계좌를 추가하시겠습니까?" 버튼 클릭 시 호출될 함수
    const addAccount = async() => {
      console.log("계좌 추가 시도");
      try{
        const response = await HomeApi.addAccount(accountList);
        goHome;
      }catch(error){
        console.error('API 호출 중 오류 발생:', error);
      }
    }; 

      // 뒤로가기 버튼 클릭 시 실행되는 함수
  const handleBackClick = () => {
    router.push('/home/bank');
  };
    
    const goHome = () => {
      router.push('/home');
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
  