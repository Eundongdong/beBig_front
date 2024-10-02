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
          alt="`프로필 사진 - ${finTypeCode}`"
        />
      </div>
      <div class="username">
        {{ userNickname }} 님
      </div>

      <!-- badgeCode가 0이 아닐 때만 배지 이미지가 버튼으로 표시됨 -->
      <div v-if="badgeCode !== 0">
        <button
          class="badge-button"
          @click="openBadgeModal"
        >
          <img
            :src="badgeImage"
            alt="Badge"
            class="badge-img"
            width="10%"
          />
        </button>
      </div>

      <div>
        이번달 미션 달성도 상위 {{ userRank }} %
      </div>
      <div>{{ finTypeInfo }}</div>
      <div class="intro-section">
        <div class="intro-title">한줄소개</div>
        <div class="intro-content">
          {{ userIntro }}
        </div>
      </div>
    </section>

    <!-- 모달이 활성화될 때 표시 -->
    <div
      v-if="showModal"
      class="modal-overlay"
      @click="closeModalOnOverlay"
    >
      <div class="modal" @click.stop>
        <button
          @click="closeModal"
          class="modal-close-button"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
        <img
          :src="badgeImage"
          alt="Badge Image"
          class="modal-badge-img"
          width="50%"
        />
        <h2>잠깐, 메달의 기준이 궁금하신가요?</h2>
        <p> {{ badgeName }}</p>

        <!-- badgeCode가 0이 아닌 배지 목록만 표시 -->
        <div
          v-for="badge in filteredBadgeList"
          :key="badge.badgeCode"
          class="badge-item"
        >
          <h2>{{ badge.badgeTitle }}</h2>
          <p>{{ badge.badgeDescription }}</p>
        </div>
      </div>
    </div>

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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; // useRouter 가져오기
import MypageApi from '@/api/MypageApi';

// 반응형 변수 선언
const router = useRouter(); // router 변수 선언
const userNickname = ref('');
const finTypeCode = ref('');
const badgeCode = ref('');
const userRank = ref('');
const finTypeInfo = ref('');
const userIntro = ref('');
const badgeName = ref('');
// const badgeDescription = ref(''); // 뱃지 설명
const loginType = ref('');
const myPosts = ref([]);
const myLikePosts = ref([]);
const selectedTab = ref('myPosts');
const showModal = ref(false); // 모달 표시 여부

// 뱃지 목록을 저장하는 변수
const badgeList = ref([]); // 배지 정보 배열

// badgeCode가 0이 아닌 항목만 필터링하여 반환
const filteredBadgeList = computed(() => {
  return badgeList.value.filter(
    (badge) => badge.badgeCode !== 0
  );
});

// 프로필 사진 동적 경로 설정
const profileImage = computed(() => {
  return `/images/${finTypeCode.value}.png`; // 이미지 파일명은 finTypeCode 값과 일치
});

// 뱃지 이미지 동적 경로 설정
const badgeImage = computed(() => {
  return `/images/badge/badge${badgeCode.value}.png`; // badgeCode 값에 따라 배지 이미지 설정
});

// 모달 열기 함수
const openBadgeModal = () => {
  showModal.value = true;
};

// 모달 닫기 함수
const closeModal = () => {
  showModal.value = false;
};

// 모달 외부 클릭 시 닫기 함수
const closeModalOnOverlay = (e) => {
  if (e.target === e.currentTarget) {
    closeModal();
  }
};

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
    finTypeCode.value = userInfo.finTypeCode; // 핀타입 코드
    badgeCode.value = Number(userInfo.badgeCode); // badgeCode를 숫자로 변환하여 할당
    userRank.value = userInfo.userRank; //
    finTypeInfo.value = userInfo.finTypeInfo; // 유형
    userIntro.value = userInfo.userIntro; // 한줄소개
  } catch (error) {
    console.error(
      '사용자 정보 가져오기 실패:',
      error
    );
  }
};

// 뱃지 정보 가져오는 함수
const getBadgeDetails = async () => {
  try {
    console.log(
      '뱃지 정보 가져오는 API 호출 시작'
    );
    const badgeInfo =
      await MypageApi.getBadgeInfo(); // 뱃지 정보를 가져오는 API 호출
    console.log(
      '뱃지 정보 API 호출 성공, 사용자 정보:',
      badgeInfo
    );

    badgeList.value = badgeInfo;

    console.log('현재 badgeCode:', Number(badgeCode.value));

    // badgeCode에 해당하는 배지 이름 설정
    const foundBadge = badgeList.value.find(
      (badge) => badge.badgeCode === Number(badgeCode.value)
    );

    if (foundBadge) {
      badgeName.value = foundBadge.badgeTitle;
      console.log("badgeName 설정됨: ", badgeName.value);
    } else {
      badgeName.value = "배지를 찾을 수 없습니다.";
      console.log("해당 badgeCode에 맞는 배지를 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error(
      '뱃지 정보 가져오기 실패:',
      error
    );
  }
};

// 로그인타입 가져오는 함수
const getMyLoginType = async () => {
  try {
    console.log('로그인 타입 API 호출 시작');
    const userLoginType =
      await MypageApi.getMyLoginType(); // 사용자의 정보를 가져오는 API 호출
    console.log(
      '로그인 타입 API 호출 성공 :',
      userLoginType
    );

    loginType.value = userLoginType;
  } catch (error) {
    console.error(
      '사용자 정보 가져오기 실패:',
      error
    );
  }
};

// // 미션 달성도 가져오는 함수
// const getUserMissionAchievement = async () => {
//   try {
//     console.log('미션 달성도 가져오는 API 호출 시작');
//     const userMissionAchievement = await MypageApi.getMyMissionAchievement(); // 사용자의 정보를 가져오는 API 호출
//     console.log(
//       '미션 달성도 가져오는API 호출 성공 :',userMissionAchievement);

//       missionAchievement.value = userMissionAchievement.currentScore; // 한줄소개
//   } catch (error) {
//     console.error(
//       '미션 달성도 가져오기 실패:',
//       error
//     );
//   }
// };

// 정보 수정 페이지 이동 함수
const goSettings = () => {
  // loginType에 따라 다른 페이지로 이동
  if (loginType.value === 'kakao') {
    router.push({ name: 'mypageSocialEdit' });
  } else if (loginType.value === 'general') {
    router.push({ name: 'mypageEdit' });
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
      '좋아요한 글 가져오기 실패:',
      error
    );
  }
};

// 페이지가 로드될 때 사용자 정보 가져오기
onMounted(async () => {
  await getUserInfo();
  getMyLoginType();
  // getUserMissionAchievement();
  getUserPosts();
  getUserLikePosts();
  getBadgeDetails();
  console.log(
    'Current badgeCode:',
    badgeCode.value
  ); // badgeCode 값 확인
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

.modal-badge-img {
  margin-bottom: 24px; /* 이미지와 텍스트 사이 간격 조정 */
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.modal-badge-title {
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px; /* 텍스트와 설명 사이 여백 */
}

.modal-badge-description {
  text-align: center;
  font-size: 10px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 24px; /* 설명과 다른 컨텐츠 사이 여백 */
}

.modal {
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  width: 80%; /* 모달의 크기 설정 */
  max-width: 350px;
  max-height: 60vh; /* 모달의 최대 높이를 뷰포트 높이의 80%로 설정 */
  overflow-y: auto; /* 모달 내용이 길어지면 스크롤 가능하도록 설정 */
  margin:  auto; /* 화면 가운데 정렬 */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7); /* 배경을 어둡게 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
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
