<template>
  <div class="page">
  <div class="mission-page">
    <header class="mission-header">
      <button @click="handleBack" class="back-button">
        <i class="fas fa-arrow-left"></i>
      </button>
    </header>

    <!-- 월간 미션 진행 상태 -->
      <div class="mission-status">
        <div class="mission-progress">
          <!-- "현재 미션을 달성했어요" 텍스트와 D-day를 포함하는 영역 -->
          <div class="mission-info">
            <span>현재 미션을 {{ monthlyProgress }}% 달성했어요</span>
            <!-- D-day는 이곳으로 이동 -->
            <div class="d-day">
              D-{{ remainingDays }}
            </div>
          </div>

          <!-- 진행 바 -->
          <div class="progress-bar">
            <!-- 캐릭터 이미지 (진행된 만큼 왼쪽으로 배치) -->
            <img :src="characterImage" alt="달리는 캐릭터 이미지" class="progress-character"
              :style="{ left: monthlyProgress + '%' }" />

            <!-- 진행 바 채움 -->
            <div class="progress-fill" :style="{ width: monthlyProgress + '%' }"></div>

            <!-- 깃발은 오른쪽 끝에 고정 -->
            <img src="/images/flag.png" alt="깃발 이미지" class="flag-image" />
          </div>
        </div>
    </div>

    <!-- 월간 미션 -->
      <div class="mission-list">
        <div class="mission-card">
          <div class="title-wrapper">
            <div class="mission-title">
              <h3>월간 미션</h3>
            </div>
            <span class="mission-date">{{ currentMonth }}</span>
          </div>
          <div class="mission-description">
            <span>{{ monthlyMission.missionTopic || '설명이 없습니다.' }}</span>
            <input type="checkbox" v-model="monthlyMission.IsRevoked"/>
          </div>
        </div>
      </div>

      <!-- 일간 미션 리스트 -->
        <div class="mission-list">
          <div class="mission-card">
            <div class="title-wrapper">
              <div class="mission-title">
                <h3>일간 미션</h3>
              </div>
              <span class="today-date">{{ todayDate }}</span>
            </div>
            <ul>
              <li v-for="mission in dailyMissions" :key="mission.personalDailyMissionId">
                <div class="mission-description">
                  {{ mission.missionTopic || '설명이 없습니다.' }}
                </div>
                <input type="checkbox" :checked="mission.personalDailyMissionCompleted" @change="completeMission(mission)" />
              </li>
            </ul>
          </div>
    </div>
  </div>
</div>
</template>

<script setup>
import MissionApi from '@/api/MissionApi';
import { ref, onMounted, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import HomeApi from "@/api/HomeApi";  //사용자 Fintype을 불러오기 위함

const router = useRouter();
const todayDate = computed(() => new Date().toISOString().split('T')[0]);
const currentMonth = computed(() => {
  const date = new Date();
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
});

// 페이지 상태
const monthlyProgress = ref('');  // 월간 미션 진척률
const remainingDays = ref('');       // 남은 일수
const dailyMissions = reactive([]);  //일간 미션 목록
const monthlyMission = ref(''); // 월간 미션 정보

//사용자 Fintype 불러오기
const getUser = async () => {
  try {
    const userInfo = await HomeApi.getMyInfo(); // /home/info 호출
      user.userName = userInfo.userName;
      user.finTypeCode = userInfo.finTypeCode; // 필요한 정보가 어떤건지 확인 필요
  } catch (error) {
    console.error('사용자 정보 가져오는 함수 API 호출 중 오류 발생:', error);
  }
};

// 사용자 자산유형에 따른 캐릭터 이미지 설정
const user = reactive({
        userName: '',
        finTypeCode: '' 
    });
const characterImage = computed(() => {
  switch (user.finTypeCode) {
    case 1:
      return '/images/character1.png';
    case 2:
      return '/images/character2.png';
    case 3:
      return '/images/character3.png';
    case 4:
      return '/images/character4.png';
    default:
      return '/images/0.png';
  }
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
    console.error("미션 성취도 불러오는중 에러 발생 :", error);
  }
};

//일간 미션 받아오기
const daillyMission = async () =>{
  try{
    const response = await MissionApi.getDailyMission();
    console.log(response);
    for (let i = 0; i < 3; i++) {
      dailyMissions[i] = response[i];
    }
  }catch(error){
    console.error("daily mission 불러오는중 에러 발생:", error);
  }
}

//월간 미션 받아오기
const getMonthlyMission = async () =>{
  try{
    monthlyMission.value = await MissionApi.getMonthMission();
  }catch(error){
    console.error("daily mission 불러오는중 에러 발생:", error);
  }
}

onMounted(() => {
  getUser();
  setAchievement();
  daillyMission();
  getMonthlyMission();
});


// 미션 완료 처리
const completeMission = async (mission) => {
  try {
    mission.personalDailyMissionCompleted = !mission.personalDailyMissionCompleted;
    console.log(mission);
    const missionData = {
      personalMissionId: mission.personalDailyMissionId,
      missionType: mission.missionType,
    };
    await MissionApi.updateMission(missionData);
  } catch (error) {
    console.error("미션 업데이트 중 오류 발생", error);
  }
};

// 뒤로 가기 버튼 기능
const handleBack = () => {
  router.push({ name: 'main' });
};

</script>


<style scoped>
ul {
  list-style-type: none;
}

.mission-page {
  padding: 16px;
  font-family: 'Roboto', sans-serif;
}

.mission-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
}

.back-button {
  background: none;
  border: none;
  font-size: 24px;
}

.mission-list, .mission-status{
  width: 100%;
  margin-bottom: 5%;
  background-color: #f3f3f3;
  color: black;
  border-radius: 10px;
  padding: 10px;
  border: none;
}

.mission-status {
  display: flex;
  align-items: center;
}

.mission-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.d-day {
  font-size: 16px;
  color: red;
  padding-top: 8px;
}

.progress-bar {
  flex-grow: 1;
  margin-top: 15%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-left: 8px;
  position: relative;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  transition: width 0.3s ease;
}

.progress-character {
  position: absolute;
  bottom: 10px;
  width: 50px;
  height: auto;
  z-index: 2;
  transition: left 0.3s ease;
  transform: translateX(-50%);
}

.flag-image {
  position: absolute;
  right: 0;
  bottom: 10px;
  width: 30px;
  height: auto;
}
</style>