<template>
  <div class="page">

    <div class="analysis-page">
      <!-- 총자산 분석 섹션 -->
      <div class="total-asset-section">
        <h2>총자산 분석</h2>
        <h1>{{ totalBalance }}원</h1>
        <div class="bar-chart">
        <div
            class="bar-segment cash"
            :style="{ width: cashPercentage + '%' }"
          ></div>
          <div
            class="bar-segment deposit-savings"
            :style="{ width: depositSavingsPercentage + '%' }"
          ></div>
        </div>
        <!-- 범례 -->
        <div class="legend">
          <div class="legend-item">
            <span class="legend-color cash"></span> 입출금 자산
          </div>
          <div class="legend-item">
            <span class="legend-color deposit-savings"></span> 예적금 자산
          </div>
        </div>
    </div>
  
      <!-- 소비 분석 섹션 -->
      <div class="spending-analysis-section">
        <h2>소비 분석</h2>
        <!-- 년도 선택 드롭다운 추가 -->
      <div class="year-selector">
        <label for="year">년도 선택:</label>
        <select id="year" v-model="selectedYear" @change="getSpendingPatterns">
          <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
        <p>
          지난달보다 {{spendings.previousMonthDiff}} 더
          썼어요.
        </p>
        <div><canvas id="spendingChart"></canvas></div>
      </div>
  
      <!-- 예·적금 추천 섹션 -->
      <div class="savings-recommendation-section">
        <h2>예·적금 추천</h2>
        <button @click="getRandomRecommendations" class="recommendation-btn">다른 은행 상품 보기</button>
        <p>이 상품은 어떠세요?</p>
        
        <div class="recommendation-carousel">
          <div class="carousel-slide" @click="slideRight">
            <p>주 거래 은행 상품</p>
            <p>적금상품</p>
            <ul>
              <li v-if="depositRecomendations[0]" class="product-item">
                <img :src="`../../../public/images/bank/${depositRecomendations[0].bankName}.png`">
                <span>{{ depositRecomendations[0].depositProductName}}</span>
              </li>
              <li v-if="depositRecomendations[0]"><p>최고우대금리: {{ depositRecomendations[0].depositProductMaxRate}}   기간: {{ depositRecomendations[0].depositProductTerm}}개월</p></li>
              <li v-if="depositRecomendations[0]"><a :href="depositRecomendations[0].bankUrl" target="_blank">홈페이지 방문하기</a></li>
              <li v-if="depositRecomendations[1]" class="product-item">
                <img :src="`../../../public/images/bank/${depositRecomendations[1].bankName}.png`">
                <span>{{ depositRecomendations[1].depositProductName }}</span>
              </li>
              <li v-if="depositRecomendations[1]"><p>최고우대금리: {{ depositRecomendations[1].depositProductMaxRate}}   기간: {{ depositRecomendations[1].depositProductTerm}}개월</p></li>
              <li v-if="depositRecomendations[1]"><a :href="depositRecomendations[1].bankUrl" target="_blank">홈페이지 방문하기</a></li>
            </ul>
            <p>예금상품</p>
            <ul>
              <li v-if="savingsRecommendations[0]" class="product-item">
                <img :src="`../../../public/images/bank/${savingsRecommendations[0].bankName}.png`">
                <span>{{ savingsRecommendations[0].savingsProductName }}</span>
              </li>
              <li v-if="savingsRecommendations[0]"><p>최고우대금리: {{ savingsRecommendations[0].savingsProductMaxRate}}   기간: {{ savingsRecommendations[0].savingsProductTerm}}개월</p></li>
              <li v-if="savingsRecommendations[0]"><a :href="savingsRecommendations[0].bankUrl" target="_blank">홈페이지 방문하기</a></li>
              <li v-if="savingsRecommendations[1]" class="product-item">
                <img :src="`../../../public/images/bank/${savingsRecommendations[1].bankName}.png`">
                <span>{{ savingsRecommendations[1].savingsProductName }}</span>
              </li>
              <li v-if="savingsRecommendations[1]"><p>최고우대금리: {{ savingsRecommendations[1].savingsProductMaxRate}}   기간: {{ savingsRecommendations[1].savingsProductTerm}}개월</p></li>
              <li v-if="savingsRecommendations[1]"><a :href="savingsRecommendations[1].bankUrl" target="_blank">홈페이지 방문하기</a></li>
            </ul>
          </div>

          <div class="carousel-slide" @click="slideLeft">
            <p>다른 은행 상품</p>
            <p>적금상품</p>
            <ul>
              <li v-if="depositRecomendations[randomnumber1]" class="product-item">
                <img :src="`../../../public/images/bank/${depositRecomendations[randomnumber1].bankName}.png`">
                <span>{{ depositRecomendations[randomnumber1].depositProductName }}</span>
              </li>
              <li v-if="depositRecomendations[randomnumber1]"><p>최고우대금리: {{ depositRecomendations[randomnumber1].depositProductMaxRate}}   기간: {{ depositRecomendations[randomnumber1].depositProductTerm}}개월</p></li>
              <li v-if="depositRecomendations[randomnumber1]"><a :href="depositRecomendations[randomnumber1].bankUrl" target="_blank">홈페이지 방문하기</a></li>
              <li v-if="depositRecomendations[randomnumber2]" class="product-item">
                <img :src="`../../../public/images/bank/${depositRecomendations[randomnumber2].bankName}.png`">
                <span>{{ depositRecomendations[randomnumber2].depositProductName }}</span>
              </li>
              <li v-if="depositRecomendations[randomnumber2]"><p>최고우대금리: {{ depositRecomendations[randomnumber2].depositProductMaxRate}}   기간: {{ depositRecomendations[randomnumber2].depositProductTerm}}개월</p></li>
              <li v-if="depositRecomendations[randomnumber2]"><a :href="depositRecomendations[randomnumber2].bankUrl" target="_blank">홈페이지 방문하기</a></li>
            </ul>
            <p>예금상품</p>
            <ul>
              <li v-if="savingsRecommendations[randomnumber3]" class="product-item">
                <img :src="`../../../public/images/bank/${savingsRecommendations[randomnumber3].bankName}.png`">
                <span>{{ savingsRecommendations[randomnumber3].savingsProductName }}</span>
              </li>
              <li v-if="savingsRecommendations[randomnumber3]"><p>최고우대금리: {{ savingsRecommendations[randomnumber3].savingsProductMaxRate}}   기간: {{ savingsRecommendations[randomnumber3].savingsProductTerm}}개월</p></li>
              <li v-if="savingsRecommendations[randomnumber3]"><a :href="savingsRecommendations[randomnumber3].bankUrl" target="_blank">홈페이지 방문하기</a></li>
              <li v-if="savingsRecommendations[randomnumber4]" class="product-item">
                <img :src="`../../../public/images/bank/${savingsRecommendations[randomnumber4].bankName}.png`">
                <span>{{ savingsRecommendations[randomnumber4].savingsProductName }}</span>
              </li>
              <li v-if="savingsRecommendations[randomnumber4]"><p>최고우대금리: {{ savingsRecommendations[randomnumber4].savingsProductMaxRate}}   기간: {{ savingsRecommendations[randomnumber4].savingsProductTerm}}개월</p></li>
              <li v-if="savingsRecommendations[randomnumber4]"><a :href="savingsRecommendations[randomnumber4].bankUrl" target="_blank">홈페이지 방문하기</a></li>
            </ul>
          </div>
        </div>
      </div>
  
      <!-- 연령대별 총자산 비교 섹션 -->
      <div class="age-group-analysis-section">
        <h2>연령대별 총자산 비교</h2>
        <h3>{{ ageRange }}세 나이대에서 당신의 자산 순위는</h3>

        <!--삼각형 그리기 -->
        <div class="triangle-container">
          <div class="triangle"></div>
          <div class="rank-line" id="rankLine"></div>
          <div class="rank-text" id="rankText"></div>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script setup>
  import { onMounted, ref, reactive, computed } from 'vue';
  import AssetApi from "@/api/AssetApi";
  import Chart from 'chart.js/auto';
  import annotationPlugin from 'chartjs-plugin-annotation';  // Chart.js annotation 플러그인
  Chart.register(annotationPlugin);



//총 자산 분석
const totalBalance = ref('');
const totalCashBalance = ref('');
const totalDepositSavingsBalance = ref('');

// 총 자산 비율 계산하는 computed
const cashPercentage = computed(() => {
      return ((totalCashBalance.value / totalBalance.value) * 100).toFixed(2);
    });

    const depositSavingsPercentage = computed(() => {
      return ((totalDepositSavingsBalance.value / totalBalance.value) * 100).toFixed(2);
    });
    
const getAnalysis = async() =>{
  try{
    const response = await AssetApi.showAnalysis();
    totalBalance.value = response.totalBalance;
    totalCashBalance.value = response.totalCashBalance;
    totalDepositSavingsBalance.value = response.totalDepositSavingsBalance;
  }catch(error){
   // console.error("API 호출 중 오류 발생:", error);
  }
}



//소비 분석 부분

  const spendings = reactive({})
  const selectedYear = ref(new Date().getFullYear()); // 현재 연도로 기본 설정
  const availableYears = ref([2022, 2023, 2024]); // 선택 가능한 년도 리스트

  // 현재 월을 계산
  const currentMonth = new Date().getMonth() + 1;  // 0부터 시작하므로 1을 더함

  const getSpendingPatterns = async() =>{
    try{  
      const response = await AssetApi.showSpendingPatterns(selectedYear.value);
      spendings.previousMonthDiff = response.previousMonthDiff;

      // 현재 월에 해당하는 개수만큼 데이터를 받아옴 (예: 9월이면 9개의 값)
      spendings.monthlySum = response.monthlySum.slice(0, currentMonth);
      spendings.monthlyAverage = response.monthlyAverage;
      renderChart();
    }catch(error){
    //  console.error("API 호출 중 오류 발생:", error);
    }
  }
  let spendingChart; // 차트 인스턴스를 전역적으로 저장

  const renderChart = () => {
  const ctx = document.getElementById('spendingChart').getContext('2d');
  
  // 이전 차트가 존재하면 파괴
  if (spendingChart) {
    spendingChart.destroy();
  }
   // 새 차트 생성
  spendingChart = new Chart(ctx, {
    type: 'bar',
    data: {
      // 현재 월에 맞춰 레이블을 동적으로 생성 (예: ['1월', ..., '9월'])
      labels: Array.from({ length: currentMonth }, (_, i) => `${i + 1}월`),
      datasets: [{
        label: 'Monthly Spending',
        data: spendings.monthlySum,  // 현재 월까지의 데이터만 사용
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        annotation: {
          annotations: {
            averageLine: {
              type: 'line',
              scaleID: 'y',
              value: spendings.monthlyAverage,  // 평균 값
              borderColor: 'red',
              borderWidth: 2,
              label: {
                content: `Average: ${spendings.monthlyAverage}`,
                enabled: true,
                position: 'end'
              }
            }
          }
        }
      }
    }
  });
};

//상품 번호 무작위화
const randomnumber1 = ref('');
const randomnumber2 = ref('');
const randomnumber3 = ref('');
const randomnumber4 = ref('');
const getRandomRecommendations = () =>{
  randomnumber1.value = Math.floor(Math.random() * 6) + 2; // 2부터 7까지
  randomnumber2.value = Math.floor(Math.random() * 6) + 2;
  randomnumber3.value = Math.floor(Math.random() * 6) + 2;
  randomnumber4.value = Math.floor(Math.random() * 6) + 2;
};

// 예·적금 추천 상품
const depositRecomendations = reactive([]); // 예금 상품
const savingsRecommendations = reactive([]); //적금상품
const bankNames = {
  1: '국민은행',
  2: '신한은행',
  3: '기업은행',
  4: '우리은행',
  5: '농협은행',
  6: '하나은행'
};
const getProductRecommendations = async() =>{
    try{  
      const response = await AssetApi.showProductRecommendations();
   //   console.log(response);
      for(let i =0;i<8;i++){
        // depositRecomendations에 은행 이름 추가
      const depositBankId = response.depositRecommendations[i].bankId;
      depositRecomendations[i] = {
        ...response.depositRecommendations[i],
        bankName: bankNames[depositBankId] || '알 수 없는 은행' // bankId가 1~6 외의 값일 경우 기본값
      };

      // savingsRecommendations에 은행 이름 추가
      const savingsBankId = response.savingsRecommendations[i].bankId;
      savingsRecommendations[i] = {
        ...response.savingsRecommendations[i],
        bankName: bankNames[savingsBankId] || '알 수 없는 은행'
      };
      }

      getRandomRecommendations();
    }catch(error){
   //   console.error("API 호출 중 오류 발생:", error);
    }
  }

  // 슬라이드 인덱스 관리
const currentSlide = ref(0);

const slideLeft = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
    scrollToSlide(currentSlide.value);
  }
};

const slideRight = () => {
  if (currentSlide.value < 1) {
    currentSlide.value++;
    scrollToSlide(currentSlide.value);
  }
};

const scrollToSlide = (index) => {
  const carousel = document.querySelector('.recommendation-carousel');
  const slideWidth = carousel.clientWidth;
  carousel.scrollTo({
    left: slideWidth * index,
    behavior: 'smooth'
  });
};

  //연령대별 비교
  const rank = ref('');
  const totalSameUser = ref('');
  const ageRange = ref('');

  const getAgeComparison = async() =>{
    try{  
      const response = await AssetApi.showAgeComparison();

      rank.value = response.rank;
      totalSameUser.value = response.totalSameAgeRangeUsers;
      ageRange.value = response.ageRange;
      // 그래프를 그리는 로직
      drawTriangleGraph();
    }catch(error){
  //    console.error("API 호출 중 오류 발생:", error);
    }
  }
  const drawTriangleGraph = () => {
    const triangleHeight = 300;
    const rankPosition = (rank.value / totalSameUser.value) * triangleHeight;

    const rankLine = document.getElementById('rankLine');
    const rankText = document.getElementById('rankText');

    rankLine.style.top = `${rankPosition}px`;
    rankText.style.top = `${rankPosition - 10}px`;
    rankText.textContent = `내 등수: ${rank.value}위`;
  }


  onMounted(() => {
      getAnalysis();
      getSpendingPatterns();
      getProductRecommendations();
      getAgeComparison();
    });

    

  
  </script>
  
  <style scoped>
  /* 총 자산 분석 css */
  .bar-chart {
  display: flex;
  width: 100%;
  height: 30px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  margin-top: 20px;
}

.bar-segment {
  height: 100%;
}

.cash {
  background-color: #4CAF50; /* 입출금 자산 색 */
}

.deposit-savings {
  background-color: #2196F3; /* 예적금 자산 색 */
}
/* 범례 스타일 */
.legend {
  margin-top: 20px;
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-color {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.legend-color.cash {
  background-color: #4CAF50;
}

.legend-color.deposit-savings {
  background-color: #2196F3;
}


  /* 상품 추천 css */
  .recommendation-carousel {
  display: flex;
  overflow: hidden; /* 슬라이드 바 숨기기 */
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;  /* IE 및 Edge에서 스크롤바 숨기기 */
  scrollbar-width: none;  /* Firefox에서 스크롤바 숨기기 */
}

.recommendation-carousel::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera에서 스크롤바 숨기기 */
}

.carousel-slide {
  flex: 0 0 100%; /* 각 슬라이드를 100% 너비로 설정 */
  cursor: pointer; /* 클릭 가능하게 커서 변경 */
  transition: transform 0.3s ease-in-out; /* 애니메이션 효과 */
}

.carousel-slide:hover {
  transform: scale(1.02); /* 슬라이드에 마우스를 올릴 때 살짝 확대 */
}
  /* 이미지 좌우 정렬 */
  .savings-recommendation-section ul {
  list-style-type: none;
  padding: 0;
}

.product-item {
  display: flex;
  align-items: center; /* 수직 정렬 */
  margin-bottom: 10px;
}

.product-item img {
  width: 50px; /* 이미지 크기 조정 */
  height: auto;
  margin-right: 10px; /* 이미지와 텍스트 사이 간격 */
}

.product-item span {
  font-size: 16px;
  line-height: 1.5;
}


.year-selector {
  margin-bottom: 20px;
}

#year {
  padding: 5px;
  font-size: 16px;
}


  /* 기본 스타일 */
.analysis-page {
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* 예·적금 추천 섹션 */
.savings-recommendation-section {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f3f3f3;
  border-radius: 10px;
}

/* 캐러셀 스타일 */
.recommendation-carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.carousel-slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  margin-right: 20px;
}

ul {
  padding: 0;
  list-style: none;
}

li {
  margin-bottom: 10px;
  font-size: 16px;
}

  /* 삼각형 css */
  .triangle-container {
    position: relative;
    width: 200px;
    height: 300px;
    margin: 50px auto;
  }

  .triangle {
    width: 0;
    height: 0;
    border-left: 100px solid transparent;
    border-right: 100px solid transparent;
    border-bottom: 300px solid lightblue;
    position: relative;
  }

  .rank-line {
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: red;
  }

  .rank-text {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    color: black;
    font-size: 14px;
  }
  /* 그래프 css */
  canvas {
  max-width: 600px;
  margin: 20px auto;
}
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

  .recommendation-title {
    display: inline-block;
  }

  .recommendation-btn {
    display: inline-block;
    margin-left: 20px;
    border: 2px solid black;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  