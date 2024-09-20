import api from "@/api";

const BASE_URL = "/mission";
const headers = { "Content-Type": "multipart/form-data" };

export default {
  // 미션 목록 조회
  async showMission(userNo) {
    const { data } = await api.get(`${BASE_URL}/${userNo}`);
    console.log("MISSION GET LIST", data);
    return data;
  },

  // 미션 완료
  async updateMission(userNo, mission) {
    const formData = new FormData();
    for (const key in mission) {
      formData.append(key, mission[key]);
    }

    const { data } = await api.post(`${BASE_URL}/${userNo}`, formData, { headers });
    console.log("MISSION POST UPDATE", data);
    return data;
  }
};