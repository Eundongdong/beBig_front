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
        <option value="" disabled>카테고리를 선택해주세요</option> <!-- Placeholder 추가 -->
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select>
    </div>

    <!-- 본문 입력 -->
    <div class="form-group">
      <label for="content">본문</label>
      <textarea v-model="formData.content" id="content"
        placeholder="다른 사용자에게 유용한 정보를 제공해주세요. 광고성 & 홍보성 게시글은 안돼요."></textarea>
    </div>

    <!-- 사진 추가하기 -->
    <div class="form-group">
      <label>사진 추가하기</label>
      <input type="file" accept="image/*" @change="onFileChange" multiple />
      <!-- <ul>
        <li v-for="(fileName, index) in fileNames" :key="index">{{ fileName }}</li>
      </ul> -->
      <!-- 파일 이름을 쉼표로 구분하여 출력 -->
      <p>{{ fileNames.join(', ') }}</p>
      <div class="image-preview" v-if="imagePreviews.length > 0">
        <img v-for="(image, index) in imagePreviews"
         :key="index"
         :src="image"
         class="preview-img"
         @click="onImageClick(index)" 
        />
      </div>
      <p class="image-limit-msg">사진은 3개까지만 업로드할 수 있어요.</p>

    </div>

    <!-- 게시글 등록 버튼 -->
    <button @click="submitPost" class="submit-btn">게시글 등록하기</button>
  </div>
</template>




<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import communityApi from '@/api/CommunityApi'; // API 모듈 임포트

const router = useRouter();
const route = useRoute();

const postTitle=ref('');
const postContent=ref('');
const postImages=ref([]);
const postId=ref(null);


const handleBack = () => {
  // 알림창 띄우기
  const confirmed = window.confirm('게시글 작성을 취소하시겠습니까? 작성했던 정보는 모두 사라집니다.');
  if (confirmed) {
    // 사용자가 확인을 눌렀을 때 CommunityList.vue로 이동
    router.push({ name: 'communityList' });
  }
};

const formData = ref({
  title: route.query.title || '',
  content: route.query.content || '',
  images: Array.isArray(route.query.images)
    ? route.query.images
    : typeof route.query.images === 'string'
    ? route.query.images.split(',')
    : []  // null 또는 undefined일 경우 빈 배열 처리
});

const categories = ref([
  { id: 1, name: '예적금' },
  { id: 2, name: '재테크' },
  { id: 3, name: '정보공유' },
  { id: 4, name: '절약팁' },
]);

const selectedCategory = ref(''); // 새글 작성 시 빈 문자열로 초기화
const imagePreviews = ref([]);  // 기본 이미지 미리보기 설정
const fileNames = ref([]); //파일명 배열

const fetchPostDetails = async (postId) => {
  try{
      const response = await communityApi.detail(postId);
      formData.value.title = response.title || '';
      formData.value.content = response.content || '';
      selectedCategory.value=response.category || '';

      //images 처리
      processImages(response.images);
  }catch(error){
    console.error("게시글을 불러오는 중 오류 발생: ", error);
  }
};

//이미지 처리 함수
const processImages=(images)=>{
  //images가 undefined일 경우 빈 배열로 처리
  if(!images){
    formData.value.images=[];
  }
  //images가 배열일 경우 그대로 사용
  else if (Array.isArray(images)) {
    formData.value.images = images; //서버에서 배열로 받아옴
  } else if (typeof images === 'string') {
    formData.value.images = images.split(','); //문자열이면 분할
  } else{
    formData.value.images=[]; //이미지가 없거나 알 수 없는 경우 빈 배열
  }
  imagePreviews.value = formData.value.images.map(img => img); //미리보기 생성
};

const onFileChange = (event) => {
  const files = Array.from(event.target.files);
  const maxImages = 3;

  if (formData.value.images.length + files.length > maxImages) {
    alert('이미지는 최대 3개까지 업로드 가능합니다.');
    return;
  }

  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      formData.value.images.push(file);  // formData에 이미지 파일 추가
      fileNames.value.push(file.name); //파일명 추가

      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviews.value.push(e.target.result);  // 미리보기 URL 저장
      };
      reader.readAsDataURL(file);
    }
  });
};

const onImageClick = (index) => {
  // 선택된 이미지 삭제
  formData.value.images.splice(index, 1);
  imagePreviews.value.splice(index, 1);
  fileNames.value.splice(index, 1);
};


const submitPost = async () => {
  const formDataToSubmit = new FormData();
  formDataToSubmit.append('title', formData.value.title);
  formDataToSubmit.append('content', formData.value.content);

  formData.value.images.forEach((image, index) => {
    formDataToSubmit.append(`image_${index}`, image);
  });

  try {
    if (route.query.postId) {
      await communityApi.update(route.query.postId, formDataToSubmit);
    } else {
      await communityApi.write(formDataToSubmit);
    }
    alert('게시글이 성공적으로 업로드되었습니다.');
    router.push({ name: 'communityList' });
  } catch (error) {
    console.error('게시글 업로드 실패:', error);
  }
};

// 컴포넌트가 마운트될 때 게시글 세부정보를 가져옵니다.
onMounted(() => {
  if (route.query.postId) {
    // 수정 모드인 경우
    postId.value=route.query.postId; //postId 저장
    fetchPostDetails(route.query.postId); //게시글 세부 정보 가져오기
  }
  

  // 쿼리로 직접 전달된 값 처리 (수정 모드와 무관하게 직접 전달된 경우)
  if (route.query.title) formData.value.title = route.query.title;
  if (route.query.content) formData.value.content = route.query.content;
  if (route.query.category) selectedCategory.value=route.query.category;
  if (route.query.images) processImages(route.query.images);
});
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