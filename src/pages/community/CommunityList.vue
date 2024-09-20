<template>
  <div>
    CommunityList
    <button @click="testCommunityApi">API 테스트</button>
  </div>
</template>

<script setup>
import communityApi from "@/api/CommunityApi";

const testCommunityApi = async () => {
  try {
    // 게시글 목록 조회 테스트
    const posts = await communityApi.list();
    console.log("게시글 목록 조회 성공:", posts);

    // 게시글 상세 조회 테스트 (postId: 1)
    const postDetail = await communityApi.detail(1);
    console.log("게시글 상세 조회 성공:", postDetail);

    // 게시글 작성 테스트
    const newPost = {
      title: "테스트 게시글",
      content: "테스트 내용",
      author: "테스터",
    };
    const createdPost = await communityApi.write(newPost);
    console.log("게시글 작성 성공:", createdPost);

    // 게시글 삭제 테스트 (postId: 1)
    await communityApi.delete(1);
    console.log("게시글 삭제 성공");

  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
  }
};
</script>

<style scoped>
/* 스타일 추가 가능 */
</style>
