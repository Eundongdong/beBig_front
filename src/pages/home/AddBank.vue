<template>
  <div class="page">
    <button @click="handleBackClick" class="back-button">&lt;</button>
    <div class="container">
      <!-- 은행 선택 섹션 -->
      <div class="bank-selection-container">
        <h2>계좌를 연결할 은행을 선택해 주세요.</h2>
        <div class="button-container">
          <button
            v-for="(bankName, index) in bankNames"
            :key="index"
            class="image-button"
            @click="selectBank(bankName)">
            <img :src="`/images/bank/${bankName}.png`" :alt="bankName" />
            <span class="bank-name">{{ changeName(bankName) }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { useBankStore } from '@/stores/bank'; // Pinia 스토어 가져오기
  
  const router = useRouter();
  const bankStore = useBankStore(); // Pinia 스토어 사용
  
  const bankNames = [
    "KB",              // 국민은행
    "Shinhan",         // 신한은행
    "IBK",             // 기업은행
    "Woori",           // 우리은행
    "NH",              // 농협은행
    "Hana",            // 하나은행
    "KakaoBank",       // 카카오뱅크
    "KBank",           // K뱅크
    "PostOfficeBank",  // 우체국
    "Shinhyup",        // 신협
    "SaemaulGeumgo",   // 새마을금고
    "Gyeongnam",       // 경남은행
    "Jeonbuk",         // 전북은행
    "Jeju",            // 제주은행
    "Gwangju",         // 광주은행
    "Busan",           // 부산은행
    "IM",              // IM
    "Citi",            // 씨티은행
    "SC",              // SC 
    "IndustrialBank",  // 산업은행
    "Suhyup"           // 수협은행
];

  
  // 뒤로가기 버튼 클릭 시 실행되는 함수
  const handleBackClick = () => {
    router.push('/home');
  };

  const changeName = (name) => {
    if (name == 'Gyeongnam') {
      return "경남은행";
    } else if (name == 'Gwangju') {
      return "광주은행";
    } else if (name == 'Busan') {
      return "부산은행";
    } else if (name == 'IndustrialBank') {
      return "산업은행";
    } else if (name == 'SaemaulGeumgo') {
      return "새마을금고은행";
    } else if (name == 'Suhyup') {
      return "수협은행";
    } else if (name == 'Shinhan') {
      return "신한은행";
    } else if (name == 'Shinhyup') {
      return "신협은행";
    } else if (name == 'Citi') {
      return "씨티은행";
    } else if (name == 'Woori') {
      return "우리은행";
    } else if (name == 'PostOfficeBank') {
      return "우체국은행";
    } else if (name == 'Jeonbuk') {
      return "전북은행";
    } else if (name == 'Jeju') {
      return "제주은행";
    } else if (name == 'KakaoBank') {
      return "카카오뱅크";
    } else if (name == 'Hana') {
      return "하나은행";
    } else if (name == 'IBK') {
      return "IBK기업은행";
    } else if (name == 'IM') {
      return "IM";
    } else if (name == 'KBank') {
      return "K뱅크";
    } else if (name == 'KB') {
      return "국민은행";
    } else if (name == 'NH') {
      return "농협은행";
    }
    else if (name == 'SC') {
      return "SC";
    }
}
  
  // 은행 선택 시 실행되는 함수
  const selectBank = (bankName) => {
    bankStore.setSelectedBank(changeName(bankName)); // Pinia 스토어에 선택된 은행 저장
  //  console.log("선택된 은행:", bankName); // 테스트용 콘솔 출력
    
    // 은행 선택 후 /home/bank-login 경로로 이동
    router.push('/home/bank-login');
  };
  </script>
  
  <style scoped>
  .container {
    position: relative;
  }
  
  .back-button {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
  
  .bank-selection-container {
    background-color: #F3F3F3;
    padding: 20px;
    border-radius: 15px;
    text-align: center;
  }
  
  h2 {
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
    color: black;
  }
  
  .button-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 가로로 3개 */
    gap: 10px; /* 버튼 간 간격 */
    justify-items: center;
  }
  
  .image-button {
    width: 100px;
    height: 120px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .image-button img {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
  
  .bank-name {
    margin-top: 5px;
    font-size: 12px;
    text-align: center;
    color: black;
  }
  </style>
  