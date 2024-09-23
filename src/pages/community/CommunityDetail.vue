<template>
    <!-- 왼쪽 상단에 뒤로가기 버튼 -->
    <button @click="handleBack" class="back-button">
      <i class="fas fa-arrow-left"></i>
    </button>

    <div v-if="post" class="community-detail">
      <!-- 게시글 정보 -->
      <div class="post-header">
        <!-- 글쓴이 캐릭터 아이콘 (fintype에 따른 아이콘 표시) -->
        <img class="author-icon" :src="getAuthorIcon(post.postWriterFinTypeCode)" alt="Author Icon" />
        <div class="post-info">
          <h1 class="post-title">{{ post.postTitle }}</h1>
          <p class="post-date">{{ formatDate(post.postCreatedTime) }}</p>
        </div>
      </div>
      
      <!-- 게시글 내용 -->
      <div class="post-body">
        <p>{{ post.postContent }}</p>
        <img v-if="post.postImagePath" :src="post.postImagePath" alt="게시글 이미지" />
      </div>
  
      <!-- 좋아요 버튼 -->
      <div class="post-footer">
        <button @click="likePost" class="like-btn">
            <i :class="post.isLiked ? 'fas fa-heart filled-heart' : 'far fa-heart empty-heart'"></i>  <!-- 좋아요 상태에 따라 하트 모양 변화 -->
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
    import {useRoute, useRouter} from 'vue-router';
    import communityApi from '@/api/CommunityApi';

    //Route를 통해 postId를 얻어옴
    const route = useRoute();
    const router = useRouter();  // useRouter를 통해 router 인스턴스 가져옴
    const postId = route.params.postId;

    const post = ref(null);  // 게시글 데이터를 저장할 post 객체 초기화

    const handleBack = () => {
      router.push({ name: 'communityList' });
    };

    const fetchPostDetail = async () => {
        try {
            const response = await communityApi.detail(postId);
            post.value = response; // response 자체가 객체일 경우 바로 할당
            post.value.isLiked = false; // 초기 좋아요 상태 설정
        } catch (error) {
            console.error('게시글을 불러오는 중 오류 발생:', error);
        }
    };

    const likePost = async () => {
    try {
      const updatedPost = await communityApi.like(post.value.postId);
      post.value.isLiked = updatedPost.isLiked;
      post.value.postLikeHits = updatedPost.postLikeHits;
    } catch (error) {
      console.error('좋아요 상태 변경 중 오류 발생:', error);
    }
  };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    const getAuthorIcon = (finTypeCode) => {
        const iconMap = {
          1: 'components/icons/finType1.png',
          2: 'components/icons/finType2.png',
          3: 'components/icons/finType3.png',
          4: 'components/icons/finType4.png',
        };
        return iconMap[finTypeCode] || '/components/icons/default.png';
    };

    // 컴포넌트가 마운트될 때 게시글 정보를 가져옵니다.
    onMounted(fetchPostDetail);
</script>




<style scoped>
  .community-detail {
    padding: 20px;
  }
  
  .post-header {
    display: flex;
    align-items: center;
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
  color: #ff4d4d; /* 채워진 하트는 빨간색 */
}

  .empty-heart {
    color: #ff4d4d; /* 빈 하트 테두리만 빨간색 */
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
  