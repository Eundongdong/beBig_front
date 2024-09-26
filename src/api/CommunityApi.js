//import api from "@/api";
import api from "@/api/ex_index";

const BASE_URL = "/community";
const headers = { "Content-Type": "multipart/form-data" };

export default {
  // 게시글 목록 조회
  async list(category, type) {
    const params = new URLSearchParams();
    if (category !== -1) params.append("category", category);
    if (type !== -1) params.append("type", type);

    const response = await api.get(`${BASE_URL}`, { params });
    console.log("COMMUNITY GET LIST", response); // API에서 반환되는 데이터를 로그로 확인
    return response; //data 속성을 반환하지 않고 전체 응답을 반환
  },

  // 게시글 상세 조회
  async detail(postId) {
    const response = await api.get(`${BASE_URL}/${postId}`);
    console.log("COMMUNITY GET DETAIL", response.data); //받아온 데이터 출력
    return response.data;
  },

  // 게시글 작성
  async write(post) {
    const formData = new FormData();
    for (const key in post) {
      if (post[key] !== null && post[key] !== undefined) {
        formData.append(key, post[key]);
      }
    }

    try {
      const response = await api.post(`${BASE_URL}/write`, formData);
      console.log("COMMUNITY POST WRITE FULL RESPONSE", response); // 전체 응답 확인
      return response.data;
    } catch (error) {
      console.error("게시글 작성 중 오류 발생:", error.response); // 오류 응답 확인
      throw error;
    }
  },

  // 게시글 좋아요
  async likePost(postId, postWriterId) {
    const response = await api.post(`${BASE_URL}/${postId}/like`, {
      postWriterId,
    });
    console.log("COMMUNITY POST LIKE", response);
    return response.data;
  },

  // 게시글 수정
  async update(postId, post) {
    const formData = new FormData();
    for (const key in post) {
      if (post[key] !== null && post[key] !== undefined) {
        formData.append(key, post[key]);
      } else {
        console.log(`${key} is null or undefined`); //디버깅 전용 로그
      }
    }
    const response = await api.post(`${BASE_URL}/${postId}/update`, formData, {headers});
    console.log("COMMUNITY POST UPDATE", response);
    return response.data;
  },

  // 게시글 삭제
  async delete(postId) {
    const response = await api.delete(`${BASE_URL}/${postId}/delete`);
    console.log("COMMUNITY DELETE", response);
    return response.data;
  },
};
