import api from '@/api';
import refreshToken from './refreshToken';


const BASE_URL = '/home';
const headers = {
  'Content-Type': 'multipart/form-data',
};

export default {
  // 내 정보 가져오기
  async getMyInfo() {
    const response = await refreshToken.checkToken();
    const { data } = await api.get(`${BASE_URL}/info`);
    return data;
},

//foote용 내 정보 가져오기(refresh 확인 안함)
  async getMyInfoFooter() {
    const { data } = await api.get(`${BASE_URL}/info`);
    return data;
},

  // 설문조사 가져오기
  async surveyList() {
    const { data } = await api.get(`${BASE_URL}/fin-test`);
    return data;
  },

  // 설문 결과 보내기
  async submitSurvey(survey) {
    const { data } = await api.post(
      `${BASE_URL}/fin-save`,
      survey,
      { 
        headers: {
          'Content-Type': 'application/json',
        },
      });
    return data;
  },

  // 설문 결과 내용 조회
  async surveyResult() {
    const { data } = await api.get(
      `${BASE_URL}/fin-type`
    );
    return data;
  },

    // 은행 아이디, 비번 받고, 해당 은행 계좌 정보 받아오기
    async getAccountList(bankAccount) {
        const { data } = await api.post(
          `${BASE_URL}/account`,
          bankAccount,
          { 
            headers: {
              'Content-Type': 'application/json',
            },
          });
        return data;
    },
    //확인된 계좌 정보들 db에 저장하기
    async addAccount(accountList){
      console.log(accountList);
      const { data } = await api.post(
        `${BASE_URL}/account/add`,
        accountList,
        { 
          headers: {
            'Content-Type': 'application/json',
          },
        });
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
    async accountList() {
        const { data } = await api.get(`${BASE_URL}/account/list`);
        return data;
    },
    
    // 거래 내역 조회
    async transactionList(accountNum) {
        const { data } = await api.get(`${BASE_URL}/account/${accountNum}/transactions`);
        return data;
    }
};

