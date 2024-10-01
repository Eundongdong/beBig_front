<template>
  <div class="page h-screen">
    <!-- 사용자 정보 컴포넌트 -->
    <button @click="logout">logout</button>
    <div class="component">
      <div
        class="flex items-center justify-between"
        v-if="user.userName !== 'NoLogin'"
      >
        <!-- 왼쪽 텍스트 영역 -->

        <h1 class="name text-xl text-left">
          <span class="big-text">{{ user.userName }}</span> 님,<br />
          안녕하세요.
        </h1>

        <!-- 오른쪽 이미지+텍스트버튼 영역 -->
        <div class="flex items-center space-x-4">
          <button class="text-button" @click="goSurvey">
            <img
              :src="`/images/${user.finTypeCode}.png`"
              class="home-profile"
            />
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
    </div>

    <!-- 모달이 활성화될 경우 표시 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModalOnOverlay">
      <div class="modal" @click.stop>
        <SurveyResult />
        <button @click="closeModal" class="modal-close-button">닫기</button>
      </div>
    </div>

    <!-- 총자산 컴포넌트 -->
    <div class="component">
      <div class="flex items-center justify-between">
        <h1 class="font-semibold text-lg">총 자산</h1>
        <!-- 계좌 추가하기 버튼 -->
        <button class="text-button" @click="goAddBank">
          {{ accountList.length == 0 ? "계좌 연결하기" : "계좌 추가하기" }}
        </button>
      </div>
      <!-- 총 자산 금액 표시 -->
      <div class="text-lg ml-2 mt-1">
        <h2>{{ totalAmount }} 원</h2>
      </div>

      <!-- 계좌 목록 출력 -->
      <div
        v-for="(account, index) in accountList"
        :key="index"
        class="account-info flex items-center justify-between p-4 mb-4 rounded-lg"
      >
        <!-- 은행 아이콘 -->
        <img
          class="bank-icon"
          :src="`/images/bank/${account.bankName}.png`"
          alt="Bank Logo"
        />
        <!-- 계좌 잔액 -->
        <div class="account-details flex-grow">
          <p class="text-sm text-gray-7--">
            잔액: <span class="font-semibold">{{ account.amount }}</span>
          </p>
        </div>
        <!-- 자세히 보러 가기 버튼 -->
        <button
          v-if="index == 0"
          class="details-button  text-black p-2"
          @click="goToAccountDetails(account)"
        >
        <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>


  <div class="mission">
    <div class="mission-header">
      <h3 class="mission-title">나의 미션</h3>
      <button @click="goToMission" class="mission-button">
        미션 보러 가기
      </button>
    </div>
    <div
      v-if="
        !mission.MonthMission &&
        !mission.dailyMission1 &&
        !mission.dailyMission2
      "
    >
      <h2>계좌를 연결하고 미션을 받아보세요</h2>
    </div>
    <div v-else>
      <h2>
        {{ mission.MonthMission }}
        <button
          :class="{
            completed: !mission.MonthMissionType,
          }"
          :disabled="!mission.MonthMissionType"
          @click="completeMission('MonthMission')"
        >
          {{ mission.MonthMissionType ? "완료" : "완료됨" }}
        </button>
      </h2>
      <h2>
        {{ mission.dailyMission1 }}
        <button
          :class="{
            completed: !mission.dailyMission1Type,
          }"
          :disabled="!mission.dailyMission1Type"
          @click="completeMission('dailyMission1')"
        >
          {{ mission.dailyMission1Type ? "완료" : "완료됨" }}
        </button>
      </h2>
      <h2>
        {{ mission.dailyMission2 }}
        <button
          :class="{
            completed: !mission.dailyMission2Type,
          }"
          :disabled="!mission.dailyMission2Type"
          @click="completeMission('dailyMission2')"
        >
          {{ mission.dailyMission2Type ? "완료" : "완료됨" }}
        </button>
      </h2>
    </div>
  </div>
  </div>
</template>

<script setup>
import HomeApi from "@/api/HomeApi";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import SurveyResult from "./SurveyResult.vue";
import { useUserStore } from "@/stores/user";
import { useHomeStore } from "@/stores/home";

const userStore = useUserStore();
const homeStore = useHomeStore();

const logout = async () => {
  userStore.logout();
  router.push("/");
};

const user = reactive({
  userName: "",
  finTypeCode: "", //2로도 바꿔보세요.
});

const accountList = reactive([
  {
    bankName: "신한",
    amount: "1,234,000원",
  },
  {
    bankName: "KB국민",
    amount: "5,678,000원",
  },
]);

const totalAmount = reactive("1234");
const mission = reactive({
  MonthMission: "aaa",
  dailyMission1: "bbb",
  dailyMission2: "ccc",
  dailyMission1Type: true,
  dailyMission2Type: false,
  MonthMissionType: true,
});

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
    const userAsset = await HomeApi.accountList();
    console.log(userAsset);
    totalAmount.value = userAsset.totalAsset; // API 데이터 형식에 맞게 수정 필요
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
  }
};

const getMission = async () => {
  try {
    const userMission = await HomeApi.missionList();
    console.log(userMission);
    Object.assign(mission, userMission); // mission 객체에 API 응답 값 설정
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
  }
};

onMounted(() => {
  getUser();
  // getAsset();
  // getMission();
});

const router = useRouter();

const goLogin = () => {
  router.push({ name: "user" });
};

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

// '미션 보러 가기' 버튼 클릭 시 Mission 페이지로 이동
const goToMission = () => {
  router.push({ name: "mission" });
};

const completeMission = (missionType) => {
  if (missionType === "MonthMission") {
    mission.MonthMissionType = false;
  } else if (missionType === "dailyMission1") {
    mission.dailyMission1Type = false;
  } else if (missionType === "dailyMission2") {
    mission.dailyMission2Type = false;
  }
};

const goToAccountDetails = (account) => {
  // /home/account 경로로 이동
  router.push("/home/account");
};

// 모달 활성화 상태 변수
const showModal = ref(false);
</script>
