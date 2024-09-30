<template>
  <div class="mypage-container">
    <!-- 상단 헤더 -->
    <header class="header">
      <button class="settings-button" @click="goSettings">
        <i class="fa-solid fa-gear"></i>
      </button>
    </header>

    <!-- 프로필 영역 -->
    <section class="profile-section">
      <div>
        <button class="visibility-btn">공개</button>
        <button class="visibility-btn">비공개</button>
      </div>
      <div class="profile-picture">
        <img :src="profileImage" alt="프로필 사진" />
      </div>
      <div class="username">{{ username }} 님</div>
      <div class="badge-section">🎖️ {{ badge }}</div>
      <div class="intro-section">
        <div class="intro-title">한줄소개</div>
        <div class="intro-content">{{ intro }}</div>
      </div>
    </section>

    <!-- 미션 진행상황 -->
    <section class="mission-section">
      <p>git 이미지 들어가야함</p>
    </section>

    <!-- 내가 작성한 글 & 좋아요한 글 -->
    <section class="posts-section">
      <div class="tabs">
        <button @click="selectTab('myPosts')" :class="{ active: selectedTab === 'myPosts' }">내가 작성한 글</button>
        <button @click="selectTab('likedPosts')" :class="{ active: selectedTab === 'likedPosts' }">좋아하는 글</button>
      </div>
      <ul v-if="selectedTab === 'myPosts'">
        <li v-for="(post, index) in myPosts" :key="index">{{ post }}</li>
      </ul>
      <ul v-if="selectedTab === 'likedPosts'">
        <li v-for="(post, index) in likedPosts" :key="index">{{ post }}</li>
      </ul>
    </section>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import HomeApi from '@/api/HomeApi'; // 사용자의 정보를 가져오는 API

// 반응형 변수 선언
const username = ref('');
const profileImage = ref('');
const badge = ref('');
const intro = ref('');
const myPosts = ref([]);
const likedPosts = ref([]);
const selectedTab = ref('myPosts');

// API에서 사용자 정보를 가져오는 함수
const getUserInfo = async () => {
  try {
    console.log('API 호출 시작');
    const userInfo = await HomeApi.getMyInfo(); // 사용자의 정보를 가져오는 API 호출
    console.log('API 호출 성공, 사용자 정보:', userInfo);
    
    username.value = userInfo.userName; //이름
    profileImage.value = userInfo.profileImage; // 이미지
    badge.value = userInfo.badge; // 뱃지
    intro.value = userInfo.intro; // 한줄소개
    myPosts.value = userInfo.myPosts; // 작성한 글 목록
    likedPosts.value = userInfo.likedPosts; // 좋아요한 글 목록
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error);
  }
};

// 페이지가 로드될 때 사용자 정보 가져오기
onMounted(() => {
  getUserInfo();
});

// 탭 선택 함수
const selectTab = (tabName) => {
  selectedTab.value = tabName;
};

</script>

<style >
.mypage-container {
  padding: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

.settings-button {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
}

.profile-section {
  margin-top: 16px;
}

.profile-picture img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.username {
  font-size: 20px;
  margin-top: 8px;
}

.badge-section {
  margin-top: 8px;
}

.intro-section {
  margin-top: 16px;
}

.intro-title {
  font-weight: bold;
}

.mission-section {
  margin-top: 16px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-top: 8px;
}

.progress {
  height: 10px;
  background-color: #4caf50;
  border-radius: 5px;
}

.posts-section {
  margin-top: 16px;
}

.tabs {
  display: flex;
  justify-content: space-between;
}

button.active {
  font-weight: bold;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  margin: 8px 0;
}

 
</style>