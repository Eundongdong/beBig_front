<template>
  <!-- 왼쪽 상단에 뒤로가기 버튼 -->
  <button @click="handleBack" class="back-button">
    <i class="fas fa-arrow-left"></i>
  </button>

  <div v-if="post" class="community-detail">
    <!-- 게시글 정보 -->
    <div class="post-header">
      <!-- 글쓴이 캐릭터 아이콘 (fintype에 따른 아이콘 표시) -->
      <img class="author-icon"
      :src="getAuthorIcon(post.postWriterFinTypeCode)"
      alt="프로필 사진"
      @click="profileClick(post.postWriterId)" />
      <div class="post-info">
        <h1 class="post-title">{{ post.postTitle }}</h1>
        <p class="post-date">{{ formatDate(post.postCreatedTime) }}</p>
      </div>
      <!-- 수정 및 삭제 버튼 -->
      <!-- <div v-if="isAuthor" class="edit-delete-buttons"> -->
      <div class="edit-delete-buttons">
        <button @click="editPost" class="edit-button">수정</button>
        <button @click="deletePost" class="delete-button">삭제</button>
      </div>
    </div>

    <!-- 게시글 내용 -->
    <div class="post-body">
      <p>{{ post.postContent }}</p>
      <img v-if="post.postImagePath" :src="post.postImagePath" alt="게시글 이미지" />
    </div>


    <!-- 좋아요 버튼 -->
    <div class="post-footer">
          <button @click="likePost(post.postId, post.postWriterId)" class="like-btn">
            <i :class="post.isLiked ? 'fas fa-heart filled-heart' : 'far fa-heart empty-heart'"></i>
            {{ post.postLikeHits }}
          </button>
        </div>
  </div>

  <div v-else>
    <p>게시글을 불러오는 중입니다...</p>
  </div>
</template>




<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import communityApi from '@/api/CommunityApi';

//Route를 통해 postId를 얻어옴
const route = useRoute();
const router = useRouter();  // useRouter를 통해 router 인스턴스 가져옴
const postId = route.params.postId;

const post = ref({});  // 게시글 데이터를 저장할 post 객체 초기화
const isAuthor = ref(false);

const handleBack = () => {
  router.push({ name: 'communityList' });
};

const fetchPostDetails = async () => {
  try {
    const response = await communityApi.detail(postId);

    //응답을 콘솔에 출력하여 확인
    console.log("API 응답: ", response);

    post.value = {
      ...response, //서버에서 받은 응답 데이터를 모두 복사
      isLiked: response.isLiked, //좋아요 상태
      postLikeHits: response.postLikeHits, //좋아요 수
      postWriterId: response.postWriterId
    };
    
    isAuthor.value = checkIfAuthor(post.value); // 작성자 확인 함수 호출
  } catch (error) {
    console.error('게시글을 불러오는 중 오류 발생:', error);
  }
};

//게시글 수정
const editPost = () => {
  console.log("전달할 데이터:", post.value);

  router.push({
    name: 'communityAdd',
    query: {
      postId: post.value.postId,
      title: post.value.postTitle,
      content: post.value.postContent,
      images: post.value.postImagePath ? [post.value.postImagePath] : [],
      postWriterId: post.value.postWriterId
    }
  });
};

//게시글 삭제
const deletePost = async () => {
  const confirmed = confirm('게시글을 삭제하시겠습니까?');
  if (confirmed) {
    try {
      await communityApi.delete(post.value.postId);
      alert('게시글이 삭제되었습니다.');
      handleBack(); // 목록으로 돌아가기
    } catch (error) {
      console.error('게시글 삭제 중 오류 발생:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  }
};

// 좋아요 기능
const likePost = async (postId, postWriterId) => {
  //postId와 postWriterId를 콘솔에 찍어서 확인
  console.log(`PostID: ${postId}, PostWriterID: ${post.postWriterId}`);
  try {
    if (!postId || !postWriterId) {
      console.error('게시글번호 또는 작성자번호가 없습니다');
      return;
    }
    console.log(`Post ID: ${postId}, Writer No: ${postWriterId}`); // 값 확인
    const response = await communityApi.likePost(postId, postWriterId);
    console.log('Response:', response);

    // 좋아요 상태를 업데이트 (post 객체에 직접 접근)
    if (post.value) {
      post.value.isLiked = !post.value.isLiked;
      post.value.postLikeHits += post.value.isLiked ? 1 : -1;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

console.log(post.value);

// 작성자 아이콘을 가져오는 함수
const getAuthorIcon = (finTypeCode) => {
  console.log("finTypeCode:", finTypeCode);
  const iconMap = {
    1: 'images/1.png',
    2: 'images/2.png',
    3: 'images/3.png',
    4: 'images/4.png',
  };
  return iconMap[finTypeCode] || 'images/0.png';
};

//작성자의 프로필을 눌렀을 때
const profileClick = async (writerNo) => {
  try {
    const userInfo = await communityApi.getUserInfo(writerNo); // 사용자 정보 API 호출
    if (userInfo.isPublic) {
      router.push({ name: 'mypage', params: { userNo: writerNo } });
    } else {
      alert("비공개 사용자입니다.");
    }
  } catch (error) {
    console.error('사용자 정보를 불러오는 중 오류 발생:', error);
    alert("사용자 정보를 불러오는 데 실패했습니다.");
  }
};



// 현재 사용자와 게시글 작성자가 같은지 확인하는 로직 (예시로 id 비교)
const checkIfAuthor = (post) => {
  // 현재 사용자 ID와 게시글 작성자 ID 비교 로직을 구현하세요.
  // 예를 들어:
  const currentUserId = 1; // 현재 사용자 ID (임시 값)
  return post.authorId === currentUserId; // post.authorId가 게시글 작성자 ID라고 가정
};

// 컴포넌트가 마운트될 때 게시글 정보를 가져옵니다.
onMounted(()=>{
  const postId = route.params.postId; // 라우터에서 postId 파라미터 가져오기
  fetchPostDetails(postId);
});
</script>




<style scoped>
.community-detail {
  padding: 20px;
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  font-size: 20px;
  margin: 0;
}

.post-date {
  font-size: 14px;
  color: #666;
}

.edit-delete-buttons {
  display: flex;
  gap: 10px;
}

.edit-button,
.delete-button {
  background-color: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 12px;
}

.edit-button:hover,
.delete-button:hover {
  text-decoration: underline;
}

.post-body img {
  max-width: 100%;
  margin-top: 16px;
}

.like-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
}

.filled-heart {
  color: #ff4d4d;
  /* 채워진 하트는 빨간색 */
}

.empty-heart {
  color: #ff4d4d;
  /* 빈 하트 테두리만 빨간색 */
}

.back-button {
  font-size: 28px;
  border: none;
  background: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>