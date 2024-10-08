<template>
  <div class="page">
    <!-- 상단 정렬 및 필터 -->
    <div>
      <!-- 정렬 버튼: 좋아요순, 최신순 -->
      <div class="flex items-start space-x-4 text-xs ml-1">
        <button
          @click="sortBy('likeHits')"
          :class="[
            'small-buttons',
            {
              active: sortType === 'likeHits',
              'font-bold': sortType === 'likeHits',
            },
          ]"
        >
          좋아요순
        </button>
        <button
          @click="sortBy('latest')"
          :class="[
            'small-buttons',
            {
              active: sortType === 'latest',
              'font-bold': sortType === 'latest',
            },
          ]"
        >
          최신순
        </button>
      </div>

      <!-- 필터 드롭다운: 카테고리, 자산유형 -->
      <div>
        <!--카테고리 필터-->
        <div
          @change="fetchPosts"
          class="flex items-center justify-between space-x-1 m-1"
        >
          <label class="text-xs font-semibold">카테고리</label>
          <button
            @click="selectCategory(-1)"
            :class="[
              'small-buttons',
              {
                active: selectedCategory === -1,
                selected: selectedCategory === -1,
              },
            ]"
          >
            전체
          </button>
          <button
            @click="selectCategory(1)"
            :class="[
              'small-buttons',
              {
                active: selectedCategory === 1,
                selected: selectedCategory === 1,
              },
            ]"
          >
            예적금
          </button>
          <button
            @click="selectCategory(2)"
            :class="[
              'small-buttons',
              {
                active: selectedCategory === 2,
                selected: selectedCategory === 2,
              },
            ]"
          >
            재테크
          </button>
          <button
            @click="selectCategory(3)"
            :class="[
              'small-buttons',
              {
                active: selectedCategory === 3,
                selected: selectedCategory === 3,
              },
            ]"
          >
            정보공유
          </button>
          <button
            @click="selectCategory(4)"
            :class="[
              'small-buttons',
              {
                active: selectedCategory === 4,
                selected: selectedCategory === 4,
              },
            ]"
          >
            절약팁
          </button>
        </div>
        <!-- 자산유형(FinType) 필터 -->
        <div
          @change="fetchPosts"
          class="flex items-center justify-between space-x-0.5 m-1"
        >
          <label class="text-xs font-semibold">자산유형</label>
          <button
            @click="selectFinType(-1)"
            :class="[
              'small-buttons',
              {
                active: selectedFinType === -1,
                selected: selectedFinType === -1,
              },
            ]"
          >
            전체
          </button>
          <button
            @click="selectFinType(1)"
            :class="[
              'small-buttons',
              {
                active: selectedFinType === 1,
                selected: selectedFinType === 1,
              },
            ]"
          >
            꿀벌
          </button>
          <button
            @click="selectFinType(2)"
            :class="[
              'small-buttons',
              {
                active: selectedFinType === 2,
                selected: selectedFinType === 2,
              },
            ]"
          >
            호랑이
          </button>
          <button
            @click="selectFinType(3)"
            :class="[
              'small-buttons',
              {
                active: selectedFinType === 3,
                selected: selectedFinType === 3,
              },
            ]"
          >
            다람쥐
          </button>
          <button
            @click="selectFinType(4)"
            :class="[
              'small-buttons',
              {
                active: selectedFinType === 4,
                selected: selectedFinType === 4,
              },
            ]"
          >
            나무늘보
          </button>
        </div>
      </div>
    </div>

    <!-- 게시글 목록 -->
    <div v-if="posts.length >0">
    <div class="post-content" v-for="post in sortedPosts" :key="post.postId">
      <!-- 프로필, 작성자, 날짜 -->
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-3">
          <img
            class="community-profile"
            :src="getProfileIcon(post.finTypeCode)"
            alt="Profile"
          />
          <span>{{post.userNickname}}</span>
        </div>
        <p class="community-content">{{ formatDate(post.postCreatedTime) }}</p>
      </div>
      <!-- 글 제목 -->
      <div class="community-title mt-1">
        <router-link
          :to="{
            name: 'communityDetail',
            params: { postId: post.postId },
          }"
          class="post-title"
          >{{ post.postTitle }}
          <i
            v-if="post.postImagePaths && post.postImagePaths.length"
            class="fa-regular fa-image ml-1"
            style="color: #5354ff"
          ></i>
        </router-link>
      </div>

      <!-- 글 내용 (미리보기) -->
      <div class="community-content truncate mt-1">
        {{ post.postContent }}
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
  </div>

  <div v-else>
      <p class="loading">게시글이 없습니다.</p>
    </div>

    <!-- 새 글 작성 버튼 -->
    <router-link
      v-if="userName != 'NoLogin'"
      to="/community/add"
      class="add-button"
    >
      <i class="fas fa-plus"></i>
    </router-link>

    <!-- 페이지네이션 -->
    <div class="pagination flex justify-center items-center space-x-4">
      <!-- 맨 처음 버튼 -->
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        class="disabled:opacity-50"
      >
        <i class="fas fa-angle-double-left"></i>
      </button>

      <!-- 이전 버튼 -->
      <button
        @click="goToPreviousPage"
        :disabled="currentPage === 1"
        class="disabled:opacity-50"
      >
        <i class="fas fa-angle-left"></i>
      </button>

      <!-- 현재 페이지 표시 -->
      <span>페이지 {{ currentPage }} / {{ totalPages }}</span>

      <!-- 다음 버튼 -->
      <button
        @click="goToNextPage"
        :disabled="currentPage === totalPages"
        class="disabled:opacity-50"
      >
        <i class="fas fa-angle-right"></i>
      </button>

      <!-- 맨 끝 버튼 -->
      <button
        @click="goToPage(totalPages)"
        :disabled="currentPage === totalPages"
        class="disabled:opacity-50"
      >
        <i class="fas fa-angle-double-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import communityApi from "@/api/CommunityApi";
import HomeApi from "@/api/HomeApi";

const userName = ref("");
// 사용자 정보를 가져오는 함수
const getUser = async () => {
  try {
    const userInfo = await HomeApi.getMyInfo(); // /home/info 호출
    userName.value = userInfo.userName;
  } catch (error) {
    console.error("사용자 정보 가져오는 함수 API 호출 중 오류 발생:", error);
  }
};

// 게시글 데이터
const posts = ref([]); //API로 가져온 게시글 데이터
const currentPage = ref(1); //현재 페이지 번호
const totalPages = ref(1); //총 페이지 수를 1로 초기화
const isFetching = ref(false); //데이터 로딩 상태 관리

const sortType = ref("latest"); // 기본 정렬은 최신순
const selectedCategory = ref("-1"); // 초기값을 '-1'로 설정
const selectedFinType = ref("-1"); // 초기값을 '-1'로 설정

// 게시글 정렬 기능
const sortedPosts = computed(() => {
  if (sortType.value === "likeHits") {
    return [...posts.value].sort((a, b) => b.postLikeHits - a.postLikeHits);
  } else if (sortType.value === "latest") {
    return [...posts.value].sort(
      (a, b) => new Date(b.postCreatedTime) - new Date(a.postCreatedTime)
    );
  }
  return posts.value;
});

// 정렬 변경 함수
const sortBy = (type) => {
  sortType.value = type;
};

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId;
};

const selectFinType = (finTypeCode) => {
  selectedFinType.value = finTypeCode;
};

// 프로필 사진 가져오는 함수
const getProfileIcon = (finTypeCode) => {
  // finTypeCode가 유효한지 확인
  if (finTypeCode && finTypeCode !== 0) {
    return `images/${finTypeCode}.png`;
  }
  // 기본 이미지 반환
  return "images/0.png";
};

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

// 게시글 목록을 API에서 가져오는 함수
const fetchPosts = async () => {
  try {
    if (isFetching.value) return;
    isFetching.value = true;

    const category = selectedCategory.value === -1 ? -1 : parseInt(selectedCategory.value);
    const finType = selectedFinType.value === -1 ? -1 : parseInt(selectedFinType.value);

    const response = await communityApi.list(category, finType, currentPage.value, 10);

    if (response && response.data) {
      posts.value = Array.isArray(response.data.posts) ? response.data.posts : [];
      totalPages.value = Math.ceil(response.data.totalPosts / 10);
    } else {
      posts.value = [];
    }
  } catch (error) {
    console.error("게시글 불러오기 실패:", error);
    posts.value = [];
  } finally {
    isFetching.value = false;
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

    //좋아요 API 호출
    const response = await communityApi.likePost(postId, userId);
    console.log("Response:", response);

    /// 좋아요 상태를 업데이트 (post 객체에 직접 접근하지 않고 posts 배열에서 해당 게시글을 찾아 업데이트)
    const postIndex = posts.value.findIndex((post) => post.postId === postId);
    if (postIndex !== -1) {
      posts.value[postIndex].isLiked = !posts.value[postIndex].isLiked;
      // 서버에서 반환된 값을 반영
      if (response && response.postLikeHits !== undefined) {
        posts.value[postIndex].postLikeHits = response.postLikeHits;
      } else {
        // 서버 응답이 없으면 로컬에서 값을 증가/감소
        posts.value[postIndex].postLikeHits += posts.value[postIndex].isLiked
          ? 1
          : -1;
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const goToPage = (pageNumber) => {
  if (pageNumber < 1 || pageNumber > totalPages.value) return;
  currentPage.value = pageNumber;
  fetchPosts();
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchPosts();
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchPosts();
  }
};

// 컴포넌트가 마운트되면 게시글을 불러옴
onMounted(() => {
  getUser();
  fetchPosts();
});
</script>