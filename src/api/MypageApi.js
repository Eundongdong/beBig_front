import api from '@/api';

const BASE_URL = '/mypage';
const headers = {
  'Content-Type': 'multipart/form-data',
};

export default {
  // 마이페이지 조회
  async getMypage() {
    const { data } = await api.get(
      `${BASE_URL}/info`
    );
    console.log('MYPAGE GET INFO', data);
    return data;
  },

  // 뱃지 설명 조회
  async getBadgeInfo() {
    const { data } = await api.get(
      `${BASE_URL}/badge`
    );
    console.log('MYPAGE GET BADGE', data);
    return data;
  },

  // 미션 달성률 조회
  async getMyMissionAchievement() {
    const { data } = await api.get(
      `${BASE_URL}/mission`
    );
    console.log(
      'MYPAGE GET MISSION ACHIEVEMENT',
      data
    );
    return data;
  },

  // 작성한 글 조회
  async getMyPosts() {
    const { data } = await api.get(
      `${BASE_URL}/posts`
    );
    console.log('MYPAGE GET MY POSTS', data);
    return data;
  },

  // 좋아한 글 조회
  async getMyLikePosts() {
    const { data } = await api.get(
      `${BASE_URL}/mylikehits`
    );
    console.log('MYPAGE GET MY LIKE POSTS', data);
    return data;
  },

  // 로그인 타입 조회
  async getMyLoginType() {
    const { data } = await api.get(
      `${BASE_URL}/login-type`
    );
    console.log('MYPAGE GET LOGIN TYPE', data);
    return data;
  },

  // 회원정보 수정에서 기존 정보 가져오기
  async getMyExistingInfo() {
    const { data } = await api.get(`${BASE_URL}/edit-form`);
    console.log('MYPAGE GET Existing My Profile', data);
    return data;
  },

  // 회원정보 수정 (일반, 소셜 동일)
  async edit(user) {
    const { data } = await api.post(
      `${BASE_URL}/edit-save`,
      user // 객체 형태로 전송
    );
    console.log('MYPAGE POST EDIT', data);
    return data;
  },
};
