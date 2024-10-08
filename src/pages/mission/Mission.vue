<template>
  <div class="page">
    <div class="container">
      <!-- 현재 달성도 -->
      <div class="component">
        <h1 class="font-semibold text-lg">현재 달성도</h1>
        <div class="flex justify-between items-center">
          <span class="ml-2">미션을 {{ monthlyProgress }}% 달성했어요</span>
          <span class="ml-auto">D-{{ remainingDays }}</span>
        </div>
        <div class="progress-bar relative h-5 flex items-center mt-10">
          <div
            class="progress-fill relative flex-1 h-2 mx-2"
            :style="{ width: monthlyProgress + '%' }"
          >
            <img
              :src="characterImage"
              class="w-[50px] absolute transition-transform duration-200"
              :style="{
                left: 'calc(' + monthlyProgress + '% + 45px)',
                top: '-40px',
              }"
            />
          </div>
        </div>
      </div>

      <!-- 월간 미션 -->
      <div class="component">
        <h1 class="font-semibold text-lg">월간 미션</h1>
        <div class="flex justify-between">
          <span class="ml-2">{{ currentMonth }}</span>
          <div
            class="mission-status"
            :style="{ color: monthlyMission.isRevoked ? 'red' : '#5354ff' }"
          >
            {{ monthlyMission.isRevoked ? "미션 완료" : "미션 진행 중" }}

          </div>
        </div>
        <div class="mission-text">
          <span>{{ monthlyMission.missionTopic || "설명이 없습니다." }}</span>
        </div>
      </div>

      <!-- 일간 미션 -->
      <div class="component">
        <h1 class="font-semibold text-lg">일간 미션</h1>
        <div class="flex justify-between">
          <span class="ml-2">{{ todayDate }}</span>
          <div
            class="mission-status"
            :style="{ color: allDailyMissionsCompleted ? 'red' : '#5354ff' }"
          >
            {{ allDailyMissionsCompleted ? "미션 완료!" : "미션 진행 중" }}
          </div>
        </div>
        <ul>
          <li
            v-for="mission in dailyMissions"
            :key="mission.personalDailyMissionId"
            class="flex justify-between mission-text"
          >
            <div
              :class="{ 'line-through': mission.personalDailyMissionCompleted }"
            >
              {{ mission.missionTopic || "설명이 없습니다." }}
            </div>
            <input
              type="checkbox"
              :checked="mission.personalDailyMissionCompleted"
              @change="completeMission(mission)"
            />
          </li>
        </ul>

      </div>
    </div>
  </div>
</template>

<script setup>

import MissionApi from "@/api/MissionApi";
import { ref, onMounted, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import HomeApi from "@/api/HomeApi"; //사용자 Fintype을 불러오기 위함


const router = useRouter();
const todayDate = computed(() => new Date().toISOString().split("T")[0]);
const currentMonth = computed(() => {
  const date = new Date();
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
});
const isRunning = ref(false); // 캐릭터 애니메이션 상태

// 페이지 상태

const monthlyProgress = ref(""); // 월간 미션 진척률
const remainingDays = ref(""); // 남은 일수
const dailyMissions = reactive([]); //일간 미션 목록
const monthlyMission = ref(""); // 월간 미션 정보


//사용자 Fintype 불러오기
const getUser = async () => {
  try {
    const userInfo = await HomeApi.getMyInfo(); // /home/info 호출
    user.userName = userInfo.userName;
    user.finTypeCode = userInfo.finTypeCode; // 필요한 정보가 어떤건지 확인 필요
  } catch (error) {
    // console.error('사용자 정보 가져오는 함수 API 호출 중 오류 발생:', error);
  }
};

// 사용자 자산유형에 따른 캐릭터 이미지 설정
const user = reactive({

  userName: "",
  finTypeCode: "",

});

// 미션 진행률 계산 함수
const calculateMonthlyProgress = (missionData) => {
  const totalDays = missionData.totalDays || 30;
  const completedDays = missionData.completedDays || 0;
  return Math.floor((completedDays / totalDays) * 100);
};

//미션 성취도 받아오기
const setAchievement = async () => {
  try {
    const achievement = await MissionApi.getAchievement();
    monthlyProgress.value = achievement.currentScore;
    remainingDays.value = achievement.restDays;
  } catch (error) {
    // console.error("미션 성취도 불러오는중 에러 발생 :", error);
  }
};

//일간 미션 받아오기
const daillyMission = async () => {
  try {
    const response = await MissionApi.getDailyMission();
    //  console.log(response);
    for (let i = 0; i < 3; i++) {
      dailyMissions[i] = response[i];
    }
  } catch (error) {
    //console.error("daily mission 불러오는중 에러 발생:", error);
  }
};

//월간 미션 받아오기
const getMonthlyMission = async () => {
  try {
    monthlyMission.value = await MissionApi.getMonthMission();
  } catch (error) {
    //  console.error("daily mission 불러오는중 에러 발생:", error);
  }
};

onMounted(() => {
  getUser();
  setAchievement();
  daillyMission();
  getMonthlyMission();
  startAnimation();
});

// 미션 완료 처리
const completeMission = async (mission) => {
  try {
    mission.personalDailyMissionCompleted =
      !mission.personalDailyMissionCompleted;
    const missionData = {
      personalMissionId: mission.personalDailyMissionId,
      missionType: mission.missionType,
    };
    await MissionApi.updateMission(missionData);
  } catch (error) {
    //  console.error("미션 업데이트 중 오류 발생", error);
  }
};

const allDailyMissionsCompleted = computed(() => {
  return dailyMissions.length > 0 && dailyMissions.every(mission => mission.personalDailyMissionCompleted);
});

const startAnimation = () => {
  setInterval(() => {
    isRunning.value = !isRunning.value; // 상태를 반전시켜 이미지 변경
  }, 500); // 0.5초마다 상태 변경
};

const characterImage = computed(() => {
  const baseImage = `/images/character${user.finTypeCode}.png`;
  return isRunning.value ? baseImage.replace(".png", "-ani.png") : baseImage;
});
</script>

