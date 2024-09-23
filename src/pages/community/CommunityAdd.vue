<template>
    <!-- 왼쪽 상단에 뒤로가기 버튼 -->
    <button @click="handleBack" class="back-button">
      <i class="fas fa-arrow-left"></i>
    </button>

    <div class="community-add">
      <!-- 제목 입력 -->
      <div class="form-group">
        <label for="title">제목</label>
        <input v-model="formData.title" type="text" id="title" placeholder="제목을 입력해주세요" />
      </div>
  
      <!-- 카테고리 선택 -->
      <div class="form-group">
        <label for="category">카테고리 선택:</label>
        <select v-model="selectedCategory" id="category">
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </div>
  
      <!-- 본문 입력 -->
      <div class="form-group">
        <label for="content">본문</label>
        <textarea v-model="formData.content" id="content" placeholder="다른 사용자에게 유용한 정보를 제공해주세요. 광고성 & 홍보성 게시글은 안돼요."></textarea>
      </div>
  
      <!-- 사진 추가하기 -->
      <div class="form-group">
        <label>사진 추가하기</label>
        <input type="file" accept="image/*" @change="onFileChange" multiple />
        <div class="image-preview" v-if="imagePreviews.length > 0">
          <img v-for="(image, index) in imagePreviews" :key="index" :src="image" class="preview-img" />
        </div>
        <p class="image-limit-msg">사진은 3개까지만 업로드할 수 있어요.</p>
      </div>
  
      <!-- 게시글 등록 버튼 -->
      <button @click="submitPost" class="submit-btn">게시글 등록하기</button>
    </div>
</template>
 



<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import communityApi from '@/api/CommunityApi'; // API 모듈 임포트

const router = useRouter();

const handleBack = () => {
  // 알림창 띄우기
  const confirmed = window.confirm('게시글 작성을 취소하시겠습니까? 작성했던 정보는 모두 사라집니다.');
  if (confirmed) {
    // 사용자가 확인을 눌렀을 때 CommunityList.vue로 이동
    router.push({ name: 'communityList' });
  }
};

const formData = ref({
  title: '',
  content: '',
  images: [],  // 이미지 파일 배열
});

const categories=ref([
  {id: 1, name: '카테고리1'},
  {id: 2, name: '카테고리2'},
  {id: 3, name: '카테고리3'},
  {id: 4, name: '카테고리4'},
]);

const selectedCategory=ref(null);

const imagePreviews = ref([]);  // 이미지 미리보기 URL 배열

const handleImageUpload = (event) => {
  const files = event.target.files;
  const maxImages = 3;

  if (formData.value.images.length + files.length > maxImages) {
    alert('이미지는 최대 3개까지 업로드 가능합니다.');
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.startsWith('image/')) {
      formData.value.images.push(file);  // formData에 이미지 파일 추가
      
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviews.value.push(e.target.result);  // 미리보기 URL 저장
      };
      reader.readAsDataURL(file);
    }
  }
};

const removeImage = (index) => {
  formData.value.images.splice(index, 1);  // formData에서 이미지 삭제
  imagePreviews.value.splice(index, 1);  // 미리보기에서 이미지 삭제
};

const submitPost = async () => {
  const formDataToSubmit = new FormData();
  formDataToSubmit.append('title', formData.value.title);
  formDataToSubmit.append('content', formData.value.content);
  
  formData.value.images.forEach((image, index) => {
    formDataToSubmit.append(`image_${index}`, image);
  });

  try {
    await communityApi.submitPost(formDataToSubmit);
    alert('게시글이 성공적으로 업로드되었습니다.');
  } catch (error) {
    console.error('게시글 업로드 실패:', error);
  }
};
</script>




<style scoped>
  .community-add {
    padding: 16px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }
  
  input[type="text"],
  select,
  textarea {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  textarea {
    height: 150px;
    resize: none;
  }
  
  .image-preview {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
  
  .preview-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .image-limit-msg {
    color: #ff6b6b;
    font-size: 12px;
    margin-top: 10px;
  }
  
  .submit-btn {
    display: block;
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
  }
  
  .submit-btn:hover {
    background-color: #0056b3;
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
  