<template>
  <div class="page">
    <!-- 왼쪽 상단에 뒤로가기 버튼 -->
    <button @click="handleBack" class="back-button">
      <i class="fas fa-arrow-left"></i>
    </button>

    <div v-if="post" class="container">
      <!-- 수정 및 삭제 버튼 -->
      <div v-if="isAuthor" class="flex items-end justify-end">
        <button @click="editPost" class="text-button">수정</button>
        <button @click="deletePost" class="text-button">삭제</button>
      </div>
      <!-- 프로필, 작성자, 날짜 -->
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-3">
          <img
            class="community-profile"
            :src="getProfileIcon(post.finTypeCode)"
            alt="Profile"
            @click="goToUserProfile(post.userId)"
          />
          <span>{{ post.userNickname }}</span>
        </div>
        <p class="community-content">
          {{ formatDate(post.postCreatedTime) }}
        </p>
      </div>

      <!-- 글 제목 -->
      <div class="community-title mt-3">
        {{ post.postTitle }}
      </div>

      <!-- 글 내용 -->
      <div class="community-content mt-1">
        {{ post.postContent }}
      </div>

      <!-- 이미지 출력 (최대 3장) -->
      <div
        v-if="post.postImagePaths && post.postImagePaths.length"
        class="image-gallery"
      >
        <img
          v-for="(image, index) in post.postImagePaths.slice(0, 3)"
          :key="index"
          :src="image"
          alt="게시글 이미지"
          class="post-image"
          @click="openImagePopup(index)"
        />
      </div>

      <!-- 이미지 팝업 -->
      <div
        v-if="isPopupOpen"
        class="image-popup-overlay"
        @click="closeImagePopup"
      >
        <div class="image-popup-content" @click.stop>
          <img :src="currentPopupImage" alt="팝업 이미지" class="popup-image" />
          <button class="close-button" @click="closeImagePopup">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <button
            v-if="showPrevButton"
            class="nav-button prev"
            @click="changeImage(-1)"
          >
            <i class="fas fa-arrow-left"></i>
          </button>
          <button
            v-if="showNextButton"
            class="nav-button next"
            @click="changeImage(1)"
          >
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- 좋아요 버튼 -->
      <div class="mt-1 ml-2 text-[18px]">
        <button @click="likePost(post.postId, post.userId)">
          <span class="text-red-500">
            {{ post.isLiked ? "♥" : "♡" }}
          </span>
          {{ post.postLikeHits }}
        </button>
      </div>
    </div>

    <div v-else>
      <p>게시글을 불러오는 중입니다...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import communityApi from "@/api/CommunityApi";
import MypageApi from "@/api/MypageApi";

//Route를 통해 postId를 얻어옴
const route = useRoute();
const router = useRouter(); // useRouter를 통해 router 인스턴스 가져옴
const loggedInUserId = ref(null);
const isAuthor = ref(false); //사용자가 작성자인지 여부를 저장하는 변수

const post = ref({}); // 게시글 데이터를 저장할 post 객체 초기화

const handleBack = () => {
  router.push({ name: "communityList" });
};

const fetchPostDetails = async (postId) => {
  try {
    const response = await communityApi.detail(postId);

    //응답을 콘솔에 출력하여 확인
    console.log("API 응답: ", response);

    post.value = {
      ...response, //서버에서 받은 응답 데이터를 모두 복사
      isLiked: response.isLiked, //좋아요 상태
      postLikeHits: response.postLikeHits, //좋아요 수
      finTypeCode: response.finTypeCode,
      userId: response.userId,
    };

    isAuthor.value = checkIfAuthor(post.value); // 작성자 확인 함수 호출
  } catch (error) {
    console.error("게시글을 불러오는 중 오류 발생:", error);
  }
};

// 작성자 확인 함수
const checkIfAuthor = (post) => {
  return Number(post.userId) === Number(loggedInUserId.value);
};

// 이미지 팝업 관련
const isPopupOpen = ref(false);
const currentImageIndex = ref(0);

const openImagePopup = (index) => {
  currentImageIndex.value = index;
  isPopupOpen.value = true;
};

const closeImagePopup = () => {
  isPopupOpen.value = false;
};

const changeImage = (direction) => {
  if (post.value && post.value.postImagePaths) {
    const newIndex = currentImageIndex.value + direction;
    if (newIndex >= 0 && newIndex < post.value.postImagePaths.length) {
      currentImageIndex.value = newIndex;
    }
  }
};

const currentPopupImage = computed(() => {
  return post.value && post.value.postImagePaths
    ? post.value.postImagePaths[currentImageIndex.value]
    : null;
});

const showPrevButton = computed(() => {
  return post.value && post.value.postImagePaths && currentImageIndex.value > 0;
});

const showNextButton = computed(() => {
  return (
    post.value &&
    post.value.postImagePaths &&
    currentImageIndex.value < post.value.postImagePaths.length - 1
  );
});

//게시글 수정
const editPost = () => {
  console.log("전달할 데이터:", post.value);

  router.push({
    name: "communityAdd",
    query: {
      postId: post.value.postId,
      title: post.value.postTitle,
      content: post.value.postContent,
      images: post.value.postImagePath ? [post.value.postImagePath] : [],
      userId: post.value.userId,
    },
  });
};

//게시글 삭제
const deletePost = async () => {
  const confirmed = confirm("게시글을 삭제하시겠습니까?");
  if (confirmed) {
    try {
      await communityApi.delete(post.value.postId);
      alert("게시글이 삭제되었습니다.");
      handleBack(); // 목록으로 돌아가기
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  }
};

// 좋아요 기능
const likePost = async (postId, userId) => {
  //postId와 userId를 콘솔에 찍어서 확인
  console.log(`PostID: ${postId}, userID: ${userId}`);
  try {
    if (!postId || !userId) {
      console.error("게시글번호 또는 작성자번호가 없습니다");
      return;
    }
    const response = await communityApi.likePost(postId, userId);
    console.log("Response:", response);

    // 좋아요 상태를 업데이트 (post 객체에 직접 접근)
    if (post.value) {
      post.value.isLiked = !post.value.isLiked;
      post.value.postLikeHits += post.value.isLiked ? 1 : -1;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

console.log(post.value);

// 작성자 아이콘을 가져오는 함수
const getProfileIcon = (finTypeCode) => {
  // finTypeCode가 유효한지 확인
  if (finTypeCode && finTypeCode !== 0) {
    return `/images/${finTypeCode}.png`;
  }
  // 기본 이미지 반환
  return "/images/0.png";
};

const fetchLoggedInUserId = async () => {
  try {
    const userId = await MypageApi.getLoggedInUserId();
    if (userId) {
      loggedInUserId.value = userId;
    } else {
      console.error("유효한 사용자 ID를 가져오지 못했습니다.");
    }
  } catch (error) {
    console.error("로그인된 사용자 ID를 가져오는 중 오류 발생:", error);
  }
};

const goToUserProfile = async (userId) => {
  try {
    if (!loggedInUserId.value) {
      await fetchLoggedInUserId();
    }

    if (Number(userId) === Number(loggedInUserId.value)) {
      router.push({ name: "mypage" });
    } else {
      router.push({ name: "userMypage", params: { userId } });
    }
  } catch (error) {
    console.error("프로필 이동 중 오류 발생:", error);
  }
};

// 컴포넌트가 마운트될 때 게시글 정보를 가져옵니다.
onMounted(async () => {
  const postId = route.params.postId;
  if (postId) {
    await fetchLoggedInUserId(); //로그인된 사용자ID를 먼저 가져옴
    fetchPostDetails(postId);
  }
});
</script>
