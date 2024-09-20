import api from "@/api";

const BASE_URL = "/mypage";
const headers = { "Content-Type": "multipart/form-data" };

export default {
  // 마이페이지 조회
  async getMypage(userNo) {
    const { data } = await api.get(`${BASE_URL}/${userNo}/info`);
    console.log("MYPAGE GET INFO", data);
    return data;
  },

  // 뱃지 설명 조회
  async badge(userNo) {
    const { data } = await api.get(`${BASE_URL}/${userNo}/badge`);
    console.log("MYPAGE GET BADGE", data);
    return data;
  },

  // 미션 달성률 조회
  async missionAchievement(userNo) {
    const { data } = await api.get(`${BASE_URL}/${userNo}/mission-achievement`);
    console.log("MYPAGE GET MISSION ACHIEVEMENT", data);
    return data;
  },

  // 작성한 글 조회
  async myPosts(userNo) {
    const { data } = await api.get(`${BASE_URL}/${userNo}/myposts`);
    console.log("MYPAGE GET MYPOSTS", data);
    return data;
  },

  // 좋아한 글 조회
  async myLikeHits(userNo) {
    const { data } = await api.get(`${BASE_URL}/${userNo}/mylikehits`);
    console.log("MYPAGE GET MYLIKEHITS", data);
    return data;
  },

  // 회원정보 수정
  async edit(userNo, user) {
    const formData = new FormData();
    for (const key in user) {
      formData.append(key, user[key]);
    }

    const { data } = await api.put(`${BASE_URL}/${userNo}/edit`, formData, { headers });
    console.log("MYPAGE PUT EDIT", data);
    return data;
  },

  // 소셜 회원정보 수정
  async socialEdit(userNo, user) {
    const formData = new FormData();
    for (const key in user) {
      formData.append(key, user[key]);
    }

    const { data } = await api.put(`${BASE_URL}/${userNo}/social-edit`, formData, { headers });
    console.log("MYPAGE PUT SOCIAL EDIT", data);
    return data;
  }
};
