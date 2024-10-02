import api from "@/api";
import user from "@/router/user";
//import api from "@/api/ex_index"

const BASE_URL = "/mission";
const headers = { "Content-Type": "multipart/form-data" };

export default {
  // 미션 성취도 조회
  async getAchievement() {
    const { data } = await api.get(`${BASE_URL}/total`);
    return data;
  },

  //월간 미션 조회
  async getMonthMission() {
    const { data } = await api.get(`${BASE_URL}/monthly`);
    return data;
  },

  //주간 미션 조회
  async getDailyMission() {
    const { data } = await api.get(`${BASE_URL}/daily`);
    return data;
  },

  // 미션 완료
  async updateMission(mission) {
    console.log(mission);
    const { data } = await api.post(
      `${BASE_URL}/complete`,
      mission, 
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("MISSION POST UPDATE", data);
    return data;
  }
};