<template>
    <header class="header-container">
      <button class="back" @click="goBack">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
    </header>
    <!-- <div>
          <h1>자산 관련 API 테스트</h1>
          <button @click="testAssetApi">API 테스트</button>
      </div> -->
  
    <div class="analysis-page">
      <!-- 총자산 분석 섹션 -->
      <div class="total-asset-section">
        <h2>총자산 분석</h2>
        <h1>{{ totalAsset }} 원</h1>
        <div>[차트 들어가는 부분]</div>
        <!-- <div class="asset-breakdown">
          <div class="bar bank"></div>
          <div class="bar savings"></div>
        </div>
        <div class="legend">
          <span>계좌·현금</span>
          <span>예·적금</span>
        </div> -->
      </div>
  
      <!-- 소비 분석 섹션 -->
      <div class="spending-analysis-section">
        <h2>소비 분석</h2>
        <p>
          지난달보다 {{ spendingDifference }} 더
          썼어요.
        </p>
        <div>[차트 들어가는 부분]</div>
        <!-- <div class="spending-bar-chart">
          <div v-for="(amount, index) in spendingData" :key="index" class="bar">
            <span>{{ amount }}원</span>
          </div>
        </div> -->
        <!-- <div class="target-line">
          목표금액 {{ targetAmount }}원
        </div> -->
      </div>
  
      <!-- 예·적금 추천 섹션 -->
      <div class="savings-recommendation-section">
        <h2>예·적금 추천</h2>
        <p>이 상품은 어떠세요?</p>
        <!-- <ul>
          <li v-for="(product, index) in savingsProducts" :key="index">
            상품{{ index + 1 }}: {{ product }}
          </li>
        </ul> -->
      </div>
  
      <!-- 연령대별 총자산 비교 섹션 -->
      <div class="age-group-analysis-section">
        <h2>연령대별 총자산 비교</h2>
  
        <!-- 연령대별 비교 그래프 추가 -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // 총자산 정보
  const totalAsset = ref(20000000); // 총 자산을 20,000,000원으로 설정
  
  // 소비 분석 데이터
  const spendingDifference = ref('68,000원'); // 지난달과 비교해 더 쓴 금액
  const targetAmount = ref(780000); // 목표 소비 금액
  const spendingData = ref([
    100000, 200000, 150000, 250000, 300000,
  ]); // 한 달 동안의 소비 내역
  
  // 예·적금 추천 상품
  const savingsProducts = ref(['상품 1', '상품 2']); // 추천 상품 목록
  
  </script>
  
  <style scoped>
  .analysis-page {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .total-asset-section,
  .spending-analysis-section,
  .savings-recommendation-section,
  .age-group-analysis-section {
    margin-bottom: 20px;
    padding: 20px;
    background-color: #f3f3f3;
    border-radius: 10px;
  }
  
  h1 {
    font-size: 30px;
    margin-bottom: 10px;
  }
  
  h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .asset-breakdown {
    display: flex;
    margin-bottom: 10px;
  }
  
  .bar {
    height: 20px;
    border-radius: 5px;
  }
  
  .bank {
    background-color: #4a90e2;
    width: 60%; /* 계좌·현금 비율 */
  }
  
  .savings {
    background-color: #7ed321;
    width: 40%; /* 예·적금 비율 */
  }
  
  .legend {
    display: flex;
    justify-content: space-between;
  }
  
  .spending-bar-chart {
    display: flex;
    justify-content: space-between;
  }
  
  .spending-bar-chart .bar {
    background-color: #4a90e2;
    width: 20%;
    height: 100px;
    border-radius: 5px;
    margin-right: 5px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  
  .target-line {
    border-top: 2px solid red;
    text-align: center;
    margin-top: 10px;
  }
  </style>
  