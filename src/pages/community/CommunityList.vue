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
        <select v-model="selectedCategory" @change="fetchPosts">
          <option value="-1">카테고리 전체</option>
          <option value="1">예적금</option>
          <option value="2">재테크</option>
          <option value="3">정보공유</option>
          <option value="4">절약팁</option>
        </select>
        <!--자산유형(FinType) 필터-->
        <select v-model="selectedFinType" @change="fetchPosts">
          <option value="-1">유형 전체</option>
          <option value="1">꿀벌</option>
          <option value="2">호랑이</option>
          <option value="3">다람쥐</option>
          <option value="4">나무늘보</option>
        </select>
      </div>
    </div>

    <!-- 게시글 목록 -->
    <div class="post" v-for="post in sortedPosts" :key="post.postId">
      <!-- 게시글 아이템 -->
      <div class="post-item">
        <div class="post-header">
          <!-- 글쓴이 캐릭터 아이콘 (fintype에 따른 아이콘 표시)-->
          <img class="author-icon" :src="getAuthorIcon(post.postWriterFinTypeCode)" alt="Author Icon" />
          <div class="post-info">
            <router-link
              :to="{ name: 'communityDetail',
              params: { postId: post.postId } }" class="post-title">{{post.postTitle }}
            </router-link>
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
          <button @click="likePost(post.postId, post.postWriterNo)" class="like-btn">
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
import { ref, computed, onMounted, nextTick } from 'vue';
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
const selectedCategory = ref('-1'); // 초기값을 '-1'로 설정
const selectedFinType = ref('-1'); // 초기값을 '-1'로 설정

const sortedPosts = computed(() => {
  if (sortType.value === 'likeHits') {
    return [...posts.value].sort((a, b) => b.postLikeHits - a.postLikeHits);
  } else if (sortType.value === 'latest') {
    return [...posts.value].sort((a, b) => new Date(b.postCreatedTime) - new Date(a.postCreatedTime));
  }
  return posts.value;
});

// 정렬 변경 함수
const sortBy = (type) => {
  sortType.value = type;
  // 정렬 후에 화면을 다시 그리도록 Vue에 알림
  nextTick(() => {
    // 필요한 경우 여기에 추가 로직
  });
};

// // 카테고리 필터 함수
// const filterByCategory = async () => {
//   console.log("카테고리 필터링:", selectedCategory.value);
//   await fetchPosts(); // 필터링 후 다시 데이터를 불러옴
// };

// // 자산 유형 필터 함수
// const filterByFinType = async () => {
//   console.log("자산유형 필터링:", selectedFinType.value);
//   await fetchPosts();  // 필터링 후 다시 데이터를 불러옴
// };

// 작성자 아이콘을 가져오는 함수
const getAuthorIcon = (finTypeCode) => {
  const iconMap = {
    1: 'images/1.png',
    2: 'images/2.png',
    3: 'images/3.png',
    4: 'images/4.png',
  };
  return iconMap[finTypeCode] || 'images/0.png';
};

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// 게시글 목록을 API에서 가져오는 함수
const fetchPosts = async () => {
  try {
    // 선택된 값이 빈 문자열일 경우 -1로 변경
    const category = selectedCategory.value === '-1' ? -1 : parseInt(selectedCategory.value);
    const type = selectedFinType.value === '-1' ? -1 : parseInt(selectedFinType.value);

    const response = await communityApi.list(category, type); //필터링 값 전달
    console.log("API 전체 응답: ", response); // 응답 전체를 출력하여 확인
    console.log("API 응답 데이터: ", response.data);
    console.log("API 응답 타입: ", typeof response.data);

    if (response.data && Array.isArray(response.data)) {
      posts.value = response.data.map(post => ({
        ...post,
        isLiked: false,  // 기본적으로 좋아요 상태를 false로 설정
      }));
    } else {
      console.error("유효하지 않은 데이터 형식:", response.data);
    }
  } catch (error) {
    console.error('게시글 목록을 불러오는 중 오류 발생:', error);
  }
};

// 좋아요 기능
const likePost = async (postId, postWriterId) => {
  //postId와 postWriterId를 콘솔에 찍어서 확인
  console.log(`PostID: ${postId}, PostWriterID: ${postWriterId}`);
  try {
    if (!postId || !postWriterId) {
      console.error('게시글번호 또는 작성자번호가 없습니다');
      return;
    }

    //좋아요 API 호출
    const response = await communityApi.likePost(postId, postWriterId);
    console.log('Response:', response);

    
    /// 좋아요 상태를 업데이트 (post 객체에 직접 접근하지 않고 posts 배열에서 해당 게시글을 찾아 업데이트)
    const postIndex = posts.value.findIndex(post => post.postId === postId);
    if (postIndex !== -1) {
      posts.value[postIndex].isLiked = !posts.value[postIndex].isLiked;
      posts.value[postIndex].postLikeHits += posts.value[postIndex].isLiked ? 1 : -1;
    }
  } catch (error) {
    console.error('Error:', error);
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
  padding-bottom: 60px;
  /* 푸터 높이만큼 추가 */
}

.community-list {
  padding: 16px;
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
  bottom: 80px;
  /* 푸터와 겹치지 않도록 위로 올리기 */
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
  z-index: 1000;
  /* 푸터보다 위로 나오도록 설정 */
}

.add-post-button:hover {
  background-color: #0056b3;
}

.filter-sort-bar {
  display: flex;
  flex-wrap: wrap;
  /* 작은 화면에서 한 줄에 맞게 감싸도록 설정 */
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  /* 정렬 및 필터 요소 간격 조정 */
  width: 100%;
  /* 부모 컨테이너의 전체 너비 사용 */
  box-sizing: border-box;
  /* 패딩과 크기를 함께 계산 */
}

.sort-options,
.filter-options {
  display: flex;
  gap: 4px;
  /* 간격을 좁혀 작은 화면에서도 잘 맞도록 */
}

button,
select {
  flex: 1 1 auto;
  /* 요소들이 동일한 비율로 너비를 차지하도록 설정 */
  min-width: 0;
  /* 요소의 최소 너비를 제한해 더 많이 줄어들 수 있도록 */
  padding: 4px 6px;
  /* 패딩을 더 줄여서 요소들이 작아지도록 설정 */
  font-size: 10px;
  /* 텍스트 크기 유지 */
}
</style>