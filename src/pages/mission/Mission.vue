<template>
  <div>
    <h1>Mission List</h1>
    <button @click="testMissionApi">API 테스트</button>
  </div>
</template>

<script setup>
import missionApi from "@/api/MissionApi";

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
</script>

<style scoped>

</style>
