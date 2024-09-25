<template>
  <div>
    <h1>Mission List</h1>
    <button @click="testMissionApi">API 테스트</button>
  </div>

  <div class="mission-page">
    <header class="mission-header">
      <button @click="handleBack" class="back-button">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h2>미션</h2>
    </header>

    <!-- 월간 미션 진행 상태 -->
    <div class="section">
      <div class="mission-status">
        <div class="mission-progress">
          <span>현재 미션을 {{ monthlyProgress }}% 달성했어요</span>
          <!-- 진행 바 -->
          <div class="progress-bar">
            <!-- 캐릭터 이미지 (진행된 만큼 왼쪽으로 배치) -->
            <img src="/images/character.png" alt="달리는 캐릭터 이미지" class="progress-character"
              :style="{ left: monthlyProgress + '%' }" />

            <!-- 진행 바 채움 -->
            <div class="progress-fill" :style="{ width: monthlyProgress + '%' }"></div>

            <!-- 깃발은 오른쪽 끝에 고정 -->
            <img src="/images/flag.png" alt="깃발 이미지" class="flag-image" />
          </div>

          <!-- D-day -->
          <div class="d-day">
            D-{{ remainingDays }}
          </div>
        </div>
      </div>
    </div>

    <!-- 월간 미션 -->
    <div class="section">
      <div class="mission-list">
        <div class="mission-card">
          <div class="title-wrapper">
            <div class="mission-title">
              <h3>월간 미션</h3>
            </div>
            <span class="mission-date">{{ currentMonth }}</span>
          </div>
          <div class="mission-description">
            <span>{{ monthlyMission.description || '설명이 없습니다.' }}</span>
          </div>
        </div>

      </div>

      <!-- 일간 미션 리스트 -->
      <div class="section">
        <div class="mission-list">
          <div class="mission-card">
            <div class="title-wrapper">
              <div class="mission-title">
                <h3>일간 미션</h3>
              </div>
              <span class="today-date">{{ todayDate }}</span>
            </div>
            <ul>
              <li v-for="mission in dailyMissions" :key="mission.id">
                <div class="mission-description">
                  {{ mission.description || '설명이 없습니다.' }}
                </div>
                <input type="checkbox" v-model="mission.completed" @change="completeMission(mission)" />
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import MissionApi from '@/api/MissionApi';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userNo = 1; // 사용자 번호 예시. 실제로 대체해야 함
const todayDate = computed(() => new Date().toISOString().split('T')[0]);
const currentMonth = computed(() => {
  const date = new Date();
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
});

const testMissionApi = async () => {
  try {
    const userNo = 1; // 테스트용 사용자 번호

    // 미션 목록 조회 테스트
    const missions = await missionApi.showMission(userNo);
    console.log("미션 목록 조회 성공:", missions);

    // 미션 완료 테스트
    const completedMission = {
      missionId: 101,
      status: "completed",
    };
    const updateResult = await missionApi.updateMission(userNo, completedMission);
    console.log("미션 완료 성공:", updateResult);
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
  }
};

// 페이지 상태
const monthlyProgress = ref(20);  // 월간 미션 진척률(예시)
const remainingDays = ref(30);       // 남은 일수(예시)
const dailyMissions = ref([]);  //일간 미션 목록
const monthlyMission = ref([]); // 월간 미션 정보

// 미션 진행률 계산 함수
const calculateMonthlyProgress = (missionData) => {
  const totalDays = missionData.totalDays || 30;
  const completedDays = missionData.completedDays || 0;
  return Math.floor((completedDays / totalDays) * 100);
};

// // 컴포넌트가 마운트될 때 미션 데이터를 불러옴
// onMounted(async () => {
//   try {
//     const missionData = await MissionApi.showMission(userNo);
//     console.log("미션 데이터: ", missionData); // 데이터 확인을 위한 콘솔 출력

//     monthlyMission.value = missionData.monthlyMission || [];
//     dailyMissions.value = missionData.dailyMissions || [];
//     monthlyProgress.value = missionData.monthlyProgress || 0;
//     remainingDays.value = missionData.remainingDays || 0;
//   } catch (error) {
//     console.error("미션 데이터를 불러오는 중 오류 발생", error);
//   }
// });

onMounted(() => {
  // 실제 API 호출을 생략하고 임의의 데이터 사용
  const mockMissionData = {
    monthlyMission: {
      description: '한 달 동안 매일 3만 원씩 저축하기',
    },
    dailyMissions: [
      { id: 1, description: '오늘은 배달 말고, 집밥을 요리해요.', completed: false },
      { id: 2, description: '지출 내역 한 번 점검해 볼까요?', completed: true },
      { id: 3, description: '자동 이체 목록을 확인해 보세요.', completed: true }
    ],
    monthlyProgress: 40,  // 진행률
    remainingDays: 5,     // 남은 날짜
  };

  // 하드코딩된 데이터로 상태를 설정
  dailyMissions.value = mockMissionData.dailyMissions;
  monthlyProgress.value = Math.min(mockMissionData.monthlyProgress || 0, 100);
  remainingDays.value = mockMissionData.remainingDays;
  monthlyMission.value = {
    description: mockMissionData.monthlyMission.description,
  };
});

// 미션 완료 처리
const completeMission = async (mission) => {
  try {
    mission.completed = !mission.completed;
    await MissionApi.updateMission(userNo, mission);
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

.title-wrapper{
  display: flex;
  justify-content: space-between; /* 두 요소를 양쪽 끝으로 배치 */
  align-items: center; /* 수직으로 정렬 */
}

.mission-date, .today-date {
  font-size: 14px;
  color: #666;
  margin-left: auto; /* 오른쪽 정렬을 위한 auto margin */
}

.section {
  margin-bottom: 20px;
}

.mission-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mission-progress {
  position: relative;
  /* 추가: 캐릭터와 깃발을 정확한 위치에 배치하기 위해 relative로 설정 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  /* 높이 설정 */
}

.progress-bar {
  flex-grow: 1;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-left: 8px;
  position: relative;
  /* 캐릭터와 깃발 배치를 위한 relative */
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
  position: absolute;
  /* progress-bar 내부에서 위치를 명확히 함 */
  left: 0;
  /* 추가: 시작 위치를 명확히 설정 */
  top: 0;
  z-index: 1;
  transition: width 0.3s ease;
}

/* 캐릭터 이미지 설정: 진행된 만큼 위치 */
.progress-character {
  position: absolute;
  bottom: 10px;
  /* 바 위로 살짝 올려 배치 */
  width: 50px;
  height: auto;
  z-index: 2;
  transition: left 0.3s ease;
  /* 부드럽게 움직이도록 transition 추가 */
}

/* 깃발 이미지 설정: 바의 오른쪽 끝에 고정 */
.flag-image {
  position: absolute;
  right: 0;
  bottom: 10px;
  /* 바 위로 살짝 올려 배치 */
  width: 30px;
  height: auto;
}

.d-day {
  font-size: 16px;
  color: red;
  padding-left: 8px;
}

.mission-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mission-card {
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.mission-title {
  font-weight: bold;
  margin-bottom: 8px;
}

.mission-description {
  font-size: 14px;
  margin-bottom: 8px;
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: #4caf50;
}
</style>
