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

    // 계좌 추가
    async addAccount(userNo, account) {
        const formData = new FormData();
        for (const key in account) {
            formData.append(key, account[key]);
        }

        const { data } = await api.post(`${BASE_URL}/${userNo}/account/add`, formData, { headers });
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