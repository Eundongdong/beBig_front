<template>
  <div class="page h-screen">
    <!-- 사용자 정보 컴포넌트 -->
    <button class="text-button"@click="logout">logout</button>
    <div class="component">
      <div class="flex items-center justify-between" v-if="user.userName !== 'NoLogin'">
        <!-- 왼쪽 텍스트 영역 -->

        <h1 class="text-xl text-left ml-3">
          <span class="big-text">{{ user.userName }}</span> 님,<br />
          안녕하세요.
        </h1>

        <!-- 오른쪽 이미지+텍스트버튼 영역 -->
        <div class="flex items-center space-x-4">
          <button class="text-button" @click="goSurvey">
            <img :src="`/images/${user.finTypeCode}.png`" class="home-profile" />
            <h5 class="category_tag">
              {{
                user.finTypeCode == "1" ||
                  user.finTypeCode == "2" ||
                  user.finTypeCode == "3" ||
                  user.finTypeCode == "4"
                  ? "내 유형 보기"
                  : "유형검사 하러 가기"
              }}
            </h5>
          </button>
        </div>
      </div>
      <div v-else class="text-left text-lg">
        <p>
          안녕하세요.<br />우리는
          <span class="big-text">beBig</span>입니다.<br />로그인하고 더 많은
          기능을<br />이용해보시겠어요?
        </p>
        <button class="text-button" @click="goLogin">로그인 하러 가기</button>
      </div>

      <!-- 모달이 활성화될 경우 표시 -->
      <div v-if="showModal" class="modal-overlay" @click="closeModalOnOverlay">
        <div class="modal" @click.stop>
          <SurveyResult />
          <button @click="closeModal" class="modal-close-button">닫기</button>
        </div>
      </div>
    </div>



    <!-- 총자산 컴포넌트 -->
    <div class="component">
      <div class="flex items-center justify-between">
        <h1 class="font-semibold text-lg">총 자산</h1>

        <!-- 계좌 추가하기 버튼 -->
        <button v-if="user.userName == 'NoLogin'" class="text-bank" @click="goLogin">로그인하고 계좌 연결하기</button>
        <button v-if="user.userName !== 'NoLogin'" class="text-button" @click="goAddBank">
          {{ accountList.length == 0 ? "계좌 연결하기" : "계좌 추가하기" }}
        </button>
        <button v-if="user.userName == 'NoLogin'" class="text-button" @click="goLogin">
          로그인하고 계좌 연결하기</button>
      </div>

      <!-- 총 자산 금액 표시 -->
      <div class="flex items-center justify-between mt-1 relative">
        <h2 class="text-lg ml-2 mt-1">{{ formatCurrency(totalAmount) }} 원</h2>
        <!-- 자세히 보러 가기 버튼 -->
        <button v-if="accountList.length > 0"
          class="back-button text-black p-2 absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
          @click="goToAccountDetails">
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      <!-- 계좌 목록 출력 -->
      <div v-for="account in accountList" :key="accountList.accountNum"
        class="account-info flex items-center justify-between p-4 mb-0 rounded-lg">
        <!-- 은행 아이콘 -->
        <img class="bank-icon" :src="`/images/bank/${account.bankName}.png`" alt="Bank Logo" />
        <!-- 계좌 잔액 -->
        <div class="account-details flex-grow ml-2">
          <p class="text-sm text-gray-7--">
          <p>{{ account.accountName }}</p>
          잔액: <span class="font-semibold">{{ formatCurrency(account.transactionBalance) }}</span> 원
          </p>
        </div>

      </div>
    </div>

    <!-- 미션 컴포넌트 -->
    <div class="component">
      <div class="flex items-center justify-between">
        <h1 class="font-semibold text-lg">나의 미션</h1>
        <!-- 미션 보러가기 버튼 -->
        <button v-if="monthlyMission && dailyMissions" class="text-button" @click="goToMission">미션 전체 보기</button>
      </div>

      <!-- 연결된 계좌가 없는 경우 -->
      <div v-if="!monthlyMission || !dailyMissions" class="flex items-center justify-center">
        <h1 text-xl>계좌를 연결하고 미션을 받아보세요</h1>
      </div>

      <div v-else>
        <!-- 월간 미션 -->
        <div class="flex items-center justify-between">
          <label class="label ml-2">월간 미션</label>
          <div class="mission-status" :style="{ color: monthlyMission.isRevoked ? 'red' : '#5354ff' }"> {{
            monthlyMission.isRevoked ? '미션 완료' : '미션 진행 중' }}</div>
        </div>

        <div :class="['mission-text', { 'line-through': monthlyMission.isRevoked }]">
          {{ monthlyMission.missionTopic }}
        </div>

        <!-- 일간 미션 -->
        <div class="flex items-center justify-between mt-2">
          <label class="label ml-2">일간 미션</label>
          <div class="mission-status"
            :style="{ color: allDailyMissionsCompleted ? 'red' : '#5354ff' }">
            {{ allDailyMissionsCompleted ? '미션 완료!' : '미션 진행 중' }}
          </div>
        </div>

        <div class="mission-text">
          <div v-for="mission in dailyMissions" :key="mission.personalDailyMissionId"
            :class="['my-2', { 'line-through': mission.personalDailyMissionCompleted }]">
            {{ mission.missionTopic || '설명이 없습니다.' }}
          </div>
        </div>


      </div>
    </div>
  </div>

</template>

<script setup>
import HomeApi from "@/api/HomeApi";
import MissionApi from '@/api/MissionApi';
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import SurveyResult from "./SurveyResult.vue";
import { useUserStore } from '@/stores/user';
import { useHomeStore } from '@/stores/home';

const userStore = useUserStore();
const homeStore = useHomeStore();

const logout = async () => {
  userStore.logout();
  router.push('/');
}

const user = reactive({
  userName: '',
  finTypeCode: ''
});

const accountList = reactive([]);

const totalAmount = ref('');

// 사용자 정보를 가져오는 함수
const getUser = async () => {
  try {
    const userInfo = await HomeApi.getMyInfo(); // /home/info 호출
    user.userName = userInfo.userName;
    user.finTypeCode = userInfo.finTypeCode; // 필요한 정보가 어떤건지 확인 필요
    homeStore.setuserFintype(user.finTypeCode);
  } catch (error) {
    console.error("사용자 정보 가져오는 함수 API 호출 중 오류 발생:", error);
  }
};

const getAsset = async () => {
  try {
    const response = await HomeApi.accountList();
    // 모든 계좌의 transactionBalance 값을 합산
    let total = response.reduce((sum, account) => sum + account.transactionBalance, 0);
    totalAmount.value = total;  // totalAmount에 총합을 저장

    // transactionBalance로 내림차순 정렬 후 상위 2개만 추출
    const sortedAccounts = response.sort((a, b) => b.transactionBalance - a.transactionBalance).slice(0, 2);
    sortedAccounts.forEach((account, index) => {
      accountList[index] = account;
    });
    console.log(accountList);
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
  }
};

const monthlyMission = ref('');
const dailyMissions = reactive([]);
const getMission = async () => {
  try {
    const response = await MissionApi.getDailyMission();
    for (let i = 0; i < 3; i++) {
      dailyMissions[i] = response[i];
    }
    monthlyMission.value = await MissionApi.getMonthMission();
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
  }
};

const allDailyMissionsCompleted = computed(() =>
  dailyMissions.every(mission => mission.personalDailyMissionCompleted)
);

// 숫자를 0,000원 형식으로 포맷팅하는 함수
const formatCurrency = (value) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    currencyDisplay: 'narrowSymbol'
  }).format(value).replace('₩', '');
};

onMounted(() => {
  getUser();
  getAsset();
  getMission();
});

const router = useRouter();

const goAddBank = () => {
  router.push("/home/bank");
};

const goSurvey = () => {
  if (
    user.finTypeCode == "1" ||
    user.finTypeCode == "2" ||
    user.finTypeCode == "3" ||
    user.finTypeCode == "4"
  ) {
    showModal.value = true;
  } else {
    router.push("/home/survey-start");
  }
};

// 모달 닫기 함수
const closeModal = () => {
  showModal.value = false;
};
// 모달 외부 클릭 시 닫기 함수
const closeModalOnOverlay = (e) => {
  if (e.target === e.currentTarget) {
    closeModal();
  }
};

const goLogin = () => {
  router.push('/');
};

const goToMission = () => {
  router.push('/mission');
}

const goToAccountDetails = (account) => {
  // /home/account 경로로 이동
  router.push("/home/account");
};

// 모달 활성화 상태 변수
const showModal = ref(false);
</script>