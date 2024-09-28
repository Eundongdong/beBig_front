<template>
  <!-- <div>
    <h1>My Page</h1>
    <button @click="testMypageApi">Mypage API 테스트</button>
  </div> -->

  <div class="mypage">
    <!-- 상단 부분 -->
    <header class="header">
      <button @click="goBack" class="back-button">←</button>
      <h2>마이페이지</h2>
      <button class="settings-button" @click="goSettings">⚙️</button>
    </header>

    <!-- 프로필 영역 -->
    <section class="profile">
      <div class="profile-info">
        <img class="profile-image" :src="user.profileImage" alt="프로필 이미지" />
        <div class="profile-details">
          <h3 class="nickname">{{ user.nickname }} 님 🎖️</h3>
          <p class="achievement">이번달 미션 달성도 상위 30%</p>
        </div>
      </div>
      <p class="bio">{{ user.bio }}</p>
    </section>

    <!-- 미션 진행상황 -->
    <section class="mission-progress">
      <p>현재 미션을 {{ user.missionProgress }}%만큼 달성했어요</p>
      <div class="progress-bar">
        <div class="progress" :style="{ width: user.missionProgress + '%' }"></div>
      </div>
      <p class="days-left">D-{{ user.daysLeft }}</p>
    </section>

    <!-- 내가 작성한 글 / 좋아하는 글 탭 -->
    <section class="posts">
      <div class="tabs">
        <button @click="selectTab('myPosts')" :class="{ active: selectedTab === 'myPosts' }">내가 작성한 글</button>
        <button @click="selectTab('likedPosts')" :class="{ active: selectedTab === 'likedPosts' }">좋아하는 글</button>
      </div>
      <ul v-if="selectedTab === 'myPosts'">
        <li v-for="(post, index) in user.myPosts" :key="index">
          <p>{{ post.title }}</p>
          <span>{{ post.date }}</span>
          <span>❤️ {{ post.likes }}</span>
        </li>
      </ul>
      <ul v-if="selectedTab === 'likedPosts'">
        <li v-for="(post, index) in user.likedPosts" :key="index">
          <p>{{ post.title }}</p>
          <span>{{ post.date }}</span>
          <span>❤️ {{ post.likes }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
// MypageApi를 import
import mypageApi from "@/api/MypageApi";

const testMypageApi = async () => {
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
};
</script>

<style scoped>

</style>
