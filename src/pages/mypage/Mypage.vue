<template>
  <div class="mypage-container">
    <!-- 상단 헤더 -->
    <header class="header">
      <button
        class="settings-button"
        @click="goSettings"
      >
        <i class="fa-solid fa-gear"></i>
      </button>
    </header>

    <!-- 프로필 영역 -->
    <section class="profile-section">
      <div>
        <button class="visibility-btn">
          공개
        </button>
        <button class="visibility-btn">
          비공개
        </button>
      </div>
      <div class="profile-picture">
        <img
          :src="profileImage"
          alt="프로필 사진"
        />
      </div>
      <div class="username">
        {{ userNickname }} 님
      </div>
      <div class="badge-section">
        🎖️ {{ badgeCode }}
      </div>
      <div>이번달 미션 달성도 상위 30%</div>
      <div>{{ finTypeInfo }}</div>
      <div class="intro-section">
        <div class="intro-title">한줄소개</div>
        <div class="intro-content">
          {{ userIntro }}
        </div>
      </div>
    </section>

    <!-- 미션 진행상황 -->
    <section class="mission-section">
      <p>git 이미지 들어가야함</p>
    </section>

    <!-- 내가 작성한 글 & 좋아요한 글 -->
    <section class="posts-section">
      <div class="tabs">
        <button
          @click="selectTab('myPosts')"
          :class="{
            active: selectedTab === 'myPosts',
          }"
        >
          작성한 글
        </button>
        <button
          @click="selectTab('likedPosts')"
          :class="{
            active: selectedTab === 'likedPosts',
          }"
        >
          좋아하는 글
        </button>
      </div>

      <!-- 작성한 글 리스트 -->
      <ul v-if="selectedTab === 'myPosts'">
        <li
          v-for="(post, index) in myPosts"
          :key="index"
        >
          {{ post.title }}
          {{
            new Date(
              post.postTime
            ).toLocaleDateString()
          }}
          {{ post.postLikeHits }}
        </li>
      </ul>

      <!-- 좋아요한 글 리스트 -->
      <ul v-if="selectedTab === 'likedPosts'">
        <li
          v-for="(post, index) in myLikePosts"
          :key="index"
        >
          {{ post.title }}
          {{
            new Date(
              post.postTime
            ).toLocaleDateString()
          }}
          {{ post.postLikeHits }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MypageApi from '@/api/MypageApi'; // HomeApi 대신 MypageApi 사용

// 반응형 변수 선언
const userNickname = ref('');
const profileImage = ref('');
const badgeCode = ref('');
const finTypeInfo = ref('');
const userIntro = ref('');
const myPosts = ref([]);
const myLikePosts = ref([]);
const selectedTab = ref('myPosts');

// API에서 사용자 정보를 가져오는 함수
const getUserInfo = async () => {
  try {
    console.log('API 호출 시작');
    const userInfo = await MypageApi.getMypage(); // 사용자의 정보를 가져오는 API 호출
    console.log(
      'API 호출 성공, 사용자 정보:',
      userInfo
    );

    userNickname.value = userInfo.userNickname; //이름
    profileImage.value = userInfo.profileImage; // 이미지
    badgeCode.value = userInfo.badgeCode; // 뱃지
    finTypeInfo.value = userInfo.finTypeInfo; // 유형
    userIntro.value = userInfo.userIntro; // 한줄소개
  } catch (error) {
    console.error(
      '사용자 정보 가져오기 실패:',
      error
    );
  }
};

// 작성한 글 가져오는 함수
const getUserPosts = async () => {
  try {
    console.log(
      '작성한 글 가져오기 API 호출 시작'
    );
    const userPosts =
      await MypageApi.getMyPosts(); // 사용자의 정보를 가져오는 API 호출
    console.log(
      '작성한 글 가져오기 API 호출 성공 :',
      myPosts
    );

    // 작성 시간 기준으로 내림차순 정렬하여 최신 글이 먼저 나오게 처리
    myPosts.value = userPosts.sort(
      (a, b) => b.postTime - a.postTime
    );
  } catch (error) {
    console.error(
      '작성한 글 가져오기 실패:',
      error
    );
  }
};

// 좋아요한 글 가져오는 함수
const getUserLikePosts = async () => {
  try {
    console.log(
      '좋아요한 글 가져오기 API 호출 시작'
    );
    const userLikePosts =
      await MypageApi.getMyLikePosts(); // 사용자의 정보를 가져오는 API 호출
    console.log(
      '좋아요한 글 가져오기 API 호출 성공 :',
      userLikePosts
    );

    // 좋아요 수를 기준으로 내림차순, 좋아요가 같으면 작성 시간 기준으로 내림차순 정렬
    myLikePosts.value = userLikePosts.sort(
      (a, b) => {
        if (b.postLikeHits === a.postLikeHits) {
          return b.postTime - a.postTime; // 날짜 최신순
        }
        return b.postLikeHits - a.postLikeHits; // 좋아요 순
      }
    );
  } catch (error) {
    console.error(
      '작성한 글 가져오기 실패:',
      error
    );
  }
};

// 페이지가 로드될 때 사용자 정보 가져오기
onMounted(() => {
  getUserInfo();
  getUserPosts();
  getUserLikePosts();
});

// 탭 선택 함수
const selectTab = (tabName) => {
  selectedTab.value = tabName;
};
</script>

<style>
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
