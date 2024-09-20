import api from "@/api";

const BASE_URL = "/community";
const headers = { "Content-Type": "multipart/form-data" };

export default {
  // 게시글 목록 조회
  async list() {
    const { data } = await api.get(`${BASE_URL}`);
    console.log("COMMUNITY GET LIST", data);
    return data;
  },

  // 게시글 상세 조회
  async detail(postId) {
    const { data } = await api.get(`${BASE_URL}/${postId}`);
    console.log("COMMUNITY GET DETAIL", data);
    return data;
  },

  // 게시글 작성
  async write(post) {
    const formData = new FormData();
    for (const key in post) {
      formData.append(key, post[key]);
    }

    const { data } = await api.post(`${BASE_URL}/write`, formData, { headers });
    console.log("COMMUNITY POST WRITE", data);
    return data;
  },

  // 게시글 좋아요
  async like(postId) {
    const { data } = await api.post(`${BASE_URL}/${postId}/like`);
    console.log("COMMUNITY POST LIKE", data);
    return data;
  },

  // 게시글 수정
  async update(postId, post) {
    const formData = new FormData();
    for (const key in post) {
      formData.append(key, post[key]);
    }
    const { data } = await api.post(`${BASE_URL}/${postId}/update`, formData, { headers });
    console.log("COMMUNITY POST UPDATE", data);
    return data;
  },

  // 게시글 삭제
  async delete(postId) {
    const { data } = await api.delete(`${BASE_URL}/${postId}/delete`);
    console.log("COMMUNITY DELETE", data);
    return data;
  }
};