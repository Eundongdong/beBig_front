<template>
    <div>
      <h1>My Page</h1>
      <button @click="testMypageApi">Mypage API 테스트</button>
    </div>
  </template>
  
  <script>
  // MypageApi를 import
  import mypageApi from "@/api/MypageApi";
  
  export default {
    name: "Mypage",
    methods: {
      async testMypageApi() {
        try {
          const userNo = 1; // 테스트용 사용자 번호
  
          // 1. 마이페이지 정보 조회 테스트
          const mypageInfo = await mypageApi.getMypage(userNo);
          console.log("마이페이지 정보 조회 성공:", mypageInfo);
  
          // 2. 뱃지 설명 조회 테스트
          const badgeInfo = await mypageApi.badge(userNo);
          console.log("뱃지 설명 조회 성공:", badgeInfo);
  
          // 3. 미션 달성률 조회 테스트
          const missionAchievement = await mypageApi.missionAchievement(userNo);
          console.log("미션 달성률 조회 성공:", missionAchievement);
  
          // 4. 작성한 글 조회 테스트
          const myPosts = await mypageApi.myPosts(userNo);
          console.log("작성한 글 조회 성공:", myPosts);
  
          // 5. 좋아한 글 조회 테스트
          const myLikeHits = await mypageApi.myLikeHits(userNo);
          console.log("좋아한 글 조회 성공:", myLikeHits);
  
          // 6. 회원 정보 수정 테스트
          const updatedUserInfo = {
            name: "New Name",
            email: "newemail@example.com",
          };
          const editResult = await mypageApi.edit(userNo, updatedUserInfo);
          console.log("회원 정보 수정 성공:", editResult);
  
          // 7. 소셜 회원 정보 수정 테스트
          const socialEditResult = await mypageApi.socialEdit(userNo, updatedUserInfo);
          console.log("소셜 회원 정보 수정 성공:", socialEditResult);
  
        } catch (error) {
          console.error("API 호출 중 오류 발생:", error);
        }
      }
    }
  };
  </script>
  