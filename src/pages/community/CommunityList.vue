<template>
  <!-- api테스트 -->
  <div>
    CommunityList
    <button @click="testCommunityApi">API 테스트</button>
  </div>

  <div class="community-list">
    <!-- 상단의 정렬 및 필터 요소 -->
    <div class="filter-sort-bar">
      <!-- 정렬 버튼: 좋아요순, 최신순 -->
      <div class="sort-options">
        <button @click="sortBy('likeHits')" :class="{ active: sortType === 'likeHits' }">좋아요순</button>
        <button @click="sortBy('latest')" :class="{ active: sortType === 'latest' }">최신순</button>
      </div>

      <!-- 필터 드롭다운: 카테고리, 자산유형 -->
      <div class="filter-options">
        <!--카테고리 필터-->
        <select v-model="selectedCategory" @change="filterByCategory">
          <option value="">카테고리 전체</option>
          <option value="category1">카테고리 1</option>
          <option value="category2">카테고리 2</option>
          <option value="category3">카테고리 3</option>
          <option value="category4">카테고리 4</option>
        </select>
        <!--자산유형(FinType) 필터-->
        <select v-model="selectedFinType" @change="filterByFinType">
          <option value="">유형 전체</option>
          <option value="1">유형 1</option>
          <option value="2">유형 2</option>
          <option value="3">유형 3</option>
          <option value="4">유형 4</option>
        </select>
      </div>
    </div>

    <!-- 게시글 목록 -->
    <div class="post" v-for="post in filteredPosts" :key="post.postId">
      <!-- 게시글 아이템 -->
      <div class="post-item">
        <div class="post-header">
          <!-- 글쓴이 캐릭터 아이콘 (fintype에 따른 아이콘 표시)-->
          <img class="author-icon" :src="getAuthorIcon(post.postWriterFinTypeCode)" alt="Author Icon" />
          <div class="post-info">
            <router-link :to="{ name: 'communityDetail', params: { postId: post.postId } }" class="post-title">{{ post.postTitle }}</router-link>
            <p class="post-date">{{ formatDate(post.postCreatedTime) }}</p>
          </div>
        </div>
        <!-- 게시글 내용 -->
        <div class="post-body">
          <p class="post-content">{{ post.postContent }}</p>
          <img v-if="post.postImagePath" class="post-image" :src="post.postImagePath" alt="Post Image" />
        </div>
        <!-- 좋아요 버튼 추가 -->
        <div class="post-footer">
          <button @click="likePost(post)" class="like-btn">
            <i :class="post.isLiked ? 'fas fa-heart filled-heart' : 'far fa-heart empty-heart'"></i>
            {{ post.postLikeHits }}
          </button>
        </div>
      </div>
    </div>
    <!-- 새 글 작성 버튼 -->
    <router-link to="/community/add" class="add-post-button">
      <i class="fas fa-plus"></i> <!-- FontAwesome 플러스 아이콘 -->
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import communityApi from "@/api/CommunityApi";

// api테스트
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


// 게시글 데이터
const posts = ref([]);     //API로 가져온 게시글 데이터
const sortType = ref('latest');     // 기본 정렬은 최신순
const selectedCategory = ref('');
const selectedFinType = ref('');

  const filteredPosts=computed(() => {
      // 선택한 카테고리, 자산 유형에 따라 필터링
      let filtered = posts.value;

      // 카테고리 필터링
      if (selectedCategory.value) {
        filtered = filtered.filter(post => post.postCategory === selectedCategory.value);
      }

      //자산 유형 필터링
      if (selectedFinType.value) {
        filtered = filtered.filter(post => post.postWriterFinTypeCode === parseInt(selectedFinType.value));
      }

      // 정렬
      if (sortType.value === 'likeHits') {
        return filtered.sort((a, b) => b.postLikeHits - a.postLikeHits);
      } else if (sortType.value === 'latest') {
        return filtered.sort((a, b) => new Date(b.postCreatedTime) - new Date(a.postCreatedTime));
      }
      return filtered;

  });

    // 정렬 변경 함수
    const sortBy = (type) => {
      sortType.value=type;
    };

    // 카테고리 필터 함수
const filterByCategory = () => {
  console.log("카테고리 필터링:", selectedCategory.value);
};

// 자산 유형 필터 함수
const filterByFinType = () => {
  console.log("자산유형 필터링:", selectedFinType.value);
};

// 작성자 아이콘을 가져오는 함수
const getAuthorIcon = (finTypeCode) => {
  const iconMap = {
    1: '/components/icons/finType1.png',
    2: '/components/icons/finType2.png',
    3: '/components/icons/finType3.png',
    4: '/components/icons/finType4.png',
  };
  return iconMap[finTypeCode] || '/components/icons/default.png';
};

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// 게시글 목록을 API에서 가져오는 함수
const fetchPosts = async () => {
    try {
      const response = await communityApi.list();
      console.log("API 응답:", response);  // 응답 전체를 출력하여 확인
      if (Array.isArray(response)) {
        posts.value = response.map(post => ({
          ...post,
          isLiked: false,  // 기본적으로 좋아요 상태를 false로 설정
        }));
      } else if (response && Array.isArray(response.data)){
        posts.value=response.data.map(post => ({
          ...post,
          isLiked: false,
        }));
      }else{
        console.error("유효하지 않은 데이터 형식:", response);
      }
    } catch (error) {
      console.error('게시글 목록을 불러오는 중 오류 발생:', error);
    }
  };

// 좋아요 기능
const likePost = async (post) => {
  try {
    const updatedPost = await communityApi.like(post.postId);
    post.isLiked = updatedPost.isLiked;
    post.postLikeHits = updatedPost.postLikeHits;
  } catch (error) {
    console.error('좋아요 상태 변경 중 오류 발생:', error);
  }
};

// 컴포넌트가 마운트되면 게시글을 불러옴
onMounted(() => {
  fetchPosts();
});
</script>


<style scoped>
.content {
  padding: 16px;
  padding-bottom: 60px; /* 푸터 높이만큼 추가 */
}

.community-list {
  padding: 16px;
}

.filter-sort-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.sort-options, .filter-options {
  display: flex;
  gap: 8px;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background-color: #f0f0f0;
  cursor: pointer;
}

button.active {
  background-color: #007bff;
  color: #fff;
}

.post {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.author-icon {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  border-radius: 50%;
  background-color: #ccc;
}

.post-info {
  flex-grow: 1;
}

.post-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}

.post-date {
  font-size: 12px;
  color: #888;
  margin: 0;
}

.post-body {
  margin-bottom: 12px;
}

.post-content {
  font-size: 14px;
  line-height: 1.6;
}

.post-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-top: 12px;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.like-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
}

.filled-heart {
  color: #ff4d4d;
}

.empty-heart {
  color: #ff4d4d;
}

.add-post-button {
  position: fixed;
  bottom: 80px; /* 푸터와 겹치지 않도록 위로 올리기 */
  right: 20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #007bff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000; /* 푸터보다 위로 나오도록 설정 */
}

.add-post-button:hover {
  background-color: #0056b3;
}

</style>