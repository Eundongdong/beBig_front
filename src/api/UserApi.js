import api from "@/api";

const BASE_URL = "/user";
const headers = { "Content-Type": "multipart/form-data" };

export default {
  //일반 회원가입
    async signup(user) {
        const formData = new FormData();
        for (const key in user) {
            formData.append(key, user[key]);
        }

        const { data } = await api.post(`${BASE_URL}/signup`, formData, { headers });
        return data;
    },

  // ID중복체크 
    async idDuplicateCheck(userID) {
        const { data } = await api.get(`${BASE_URL}/login/${userID}`);
        return data;
    },

    // 소셜 회원가입 정보전달 
    async socialSignupInfo() {
        const { data } = await api.get(`${BASE_URL}/social-signup/info`);
        return data;
    },    

  // 소셜 회원가입 등록
    async socialSignupRegister(user) {
        const formData = new FormData();
        for (const key in user) {
            formData.append(key, user[key]);
        }

        const { data } = await api.post(`${BASE_URL}/social-signup/register`, formData, { headers });
        return data;
    },

  // 일반 로그인
    async login(user) {
        const formData = new FormData();
        for (const key in user) {
            formData.append(key, user[key]);
        }

        const { data } = await api.post(`${BASE_URL}/login`, formData, { headers });
        return data;
    },

    // 소셜 로그인 
        async socialLogin(user) {
        const formData = new FormData();
        for (const key in user) {
            formData.append(key, user[key]);
        }

        const { data } = await api.post(`${BASE_URL}/social-login`, formData, { headers });
        return data;
    },

  // 로그아웃
    async logout() {
        const { data } = await api.get(`${BASE_URL}/logout`);
        return data;
    },

  // 아이디찾기
    async findUserId(user) {
        const formData = new FormData();
        for (const key in user) {
            formData.append(key, user[key]);
        }

        const { data } = await api.post(`${BASE_URL}/find-id`, formData, { headers });
        return data;
    },
    
    // 비밀번호 찾기
    async findUserPwd(user) {
        const formData = new FormData();
        for (const key in user) {
            formData.append(key, user[key]);
        }
    
        const { data } = await api.post(`${BASE_URL}/find-pwd`, formData, { headers });
        return data;
    }
};