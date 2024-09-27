import api from '@/api';
//import api from "@/api/ex_index"

const BASE_URL = '/home';
const headers = {
  'Content-Type': 'multipart/form-data',
};

export default {
  // 내 정보 가져오기
  async getMyInfo() {
    const { data } = await api.get(`${BASE_URL}/info`);
    return data;
},


  // 설문조사 가져오기
  async surveyList(userId) {
    const { data } = await api.get(`${BASE_URL}/${userId}/survey`);
    return data;
  },

  // 설문 결과 보내기
  async submitSurvey(userId, survey) {
    const formData = new FormData();
    for (const key in survey) {
      formData.append(key, survey[key]);
    }

    const { data } = await api.post(
      `${BASE_URL}/${userId}/survey`,
      formData,
      { headers }
    );
    return data;
  },

  // 설문 결과 내용 조회
  async surveyResult(userId) {
    const { data } = await api.get(
      `${BASE_URL}/${userId}/survey-result`
    );
    return data;
  },

  // 계좌 추가
  async addAccount(userId, account) {
    const formData = new FormData();
    for (const key in account) {
      formData.append(key, account[key]);
    }

    const { data } = await api.post(
      `${BASE_URL}/${userId}/account/add`,
      formData,
      { headers }
    );
    return data;
  },

  // 미션보기
  async missionList(userId) {
    const { data } = await api.get(
      `${BASE_URL}/${userId}/mission`
    );
    console.log('HOME GET MISSIONLIST', data);
    return data;
  },

  // 계좌 목록 조회
  async accountList(userId) {
    const { data } = await api.get(
      `${BASE_URL}/${userId}/account/list`
    );
    return data;
  },

  // 거래 내역 조회
  async transactionList(userId, accountNum) {
    const { data } = await api.get(
      `${BASE_URL}/${userId}/account/${accountNum}/detail`
    );
    return data;
  },
};
