import api from "@/api";
//import api from "@/api/ex_index"

const BASE_URL = "/home";
const headers = { "Content-Type": "multipart/form-data" };

export default {
  //내정보 가져오기
    async getMyInfo(userNo) {
        const { data } = await api.get(`${BASE_URL}/${userNo}/info`);
        return data;
    },

  // 설문조사 가져오기
    async surveyList(userNo) {
        const { data } = await api.get(`${BASE_URL}/${userNo}/survey`);
        return data;
    },

  // 설문 결과 보내기
    async submitSurvey(userNo, survey) {
        const formData = new FormData();
        for (const key in survey) {
            formData.append(key, survey[key]);
        }

        const { data } = await api.post(`${BASE_URL}/${userNo}/survey`, formData, { headers });
        return data;
    },

  // 설문 결과 내용 조회
    async surveyResult(userNo) {
        const { data } = await api.get(`${BASE_URL}/${userNo}/survey-result`);
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
    async missionList(userNo) {
        const { data } = await api.get(`${BASE_URL}/${userNo}/mission`);
        console.log("HOME GET MISSIONLIST", data);
        return data;
    },

  // 계좌 목록 조회
    async accountList(userNo) {
        const { data } = await api.get(`${BASE_URL}/${userNo}/account/list`);
        return data;
    },
    
    // 거래 내역 조회
    async transactionList(userNo, accountNum) {
        const { data } = await api.get(`${BASE_URL}/${userNo}/account/${accountNum}/detail`);
        return data;
    }
};