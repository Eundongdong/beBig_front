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
      <!-- 파일 이름을 쉼표로 구분하여 출력 -->
      <p>{{ fileNames.join(', ') }}</p>

      <!-- 기존 이미지와 새로운 이미지를 미리보기로 함께 보여줍니다 -->
      <div class="image-preview" v-if="imagePreviews.length > 0">
        <img v-for="(image, index) in imagePreviews"
         :key="index"
         :src="image"
         class="preview-img"
         @click="onImageClick(index)" 
        />
      </div>
      <p class="image-limit-msg">사진은 최대 {{ maxImages }}개까지만 업로드할 수 있어요.</p>

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


const formData=ref({
  title: '',
  content: '',
  category: '',
  images: []
});


const handleBack = () => {
  // 알림창 띄우기
  const confirmed = window.confirm('게시글 작성을 취소하시겠습니까? 작성했던 정보는 모두 사라집니다.');
  if (confirmed) {
    // 사용자가 확인을 눌렀을 때 CommunityList.vue로 이동
    router.push({ name: 'communityList' });
  }
};


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
      formData.value.title = response.postTitle || '';
      formData.value.content = response.postContent || '';
      selectedCategory.value=response.category || '';
      //images 처리
      processImages(response.postImagePaths);
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
  }
  // 서버에서 받은 이미지 경로로 미리보기 이미지 배열을 생성
  imagePreviews.value = formData.value.images.map(img => img); 
  fileNames.value=formData.value.images.map(img => img.split('/').pop());
};

const maxImages = 3;

const onFileChange = (event) => {
  const files = Array.from(event.target.files);


  if (formData.value.images.length + files.length > maxImages) {
    alert(`이미지는 최대 ${maxImages}개까지 업로드 가능합니다.`);
    return;
  }

  files.forEach(file => {
    if (!file.type.startsWith('image/')) {
      alert('사진만 업로드 가능합니다.');
      return;
    }
      formData.value.images.push(file);  // formData에 이미지 파일 추가
      fileNames.value.push(file.name); //파일명 추가

      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviews.value.push(e.target.result);  // 미리보기 URL 저장
      };
      reader.readAsDataURL(file);
  });
};

const onImageClick = (index) => {
  // 선택된 이미지 삭제
  formData.value.images.splice(index, 1);
  imagePreviews.value.splice(index, 1);
  fileNames.value.splice(index, 1);
};


const submitPost = async () => {
  // 필수값 검증
  if (!formData.value.title) {
    alert('제목을 작성해주세요.');
    return;
  }

  if (!selectedCategory.value) {
    alert('카테고리를 선택해주세요.');
    return;
  }

  if (!formData.value.content) {
    alert('본문을 작성해주세요.');
    return;
  }

  const formDataToSubmit = new FormData();
  console.log(formDataToSubmit); // FormData가 올바르게 생성되었는지 확인

  formDataToSubmit.append('title', formData.value.title);
  formDataToSubmit.append('content', formData.value.content);
  formDataToSubmit.append('category', selectedCategory.value);

  formData.value.images.forEach((image, index) => {
    if (image instanceof File) {
      formDataToSubmit.append(`image_${index}`, image);  // 실제 파일 객체 추가
    } else {
      formDataToSubmit.append(`image_${index}_url`, image);  // URL 형태의 이미지를 따로 처리
    }
  });

  try {
    if (route.query.postId) {
      //수정인 경우
      await communityApi.update(route.query.postId, formDataToSubmit);
    } else {
      //새로 등록하는 경우
      await communityApi.write(formDataToSubmit);
    }
    // alert('게시글이 성공적으로 업로드되었습니다.');
    // router.push({ name: 'communityList' });
  } catch (error) {
    console.error('게시글 업로드 실패:', error);
  }
};



// 컴포넌트가 마운트될 때 게시글 세부정보를 가져옵니다.
onMounted(() => {
  // fetchCategories(); //카테고리 불러오기
  if (route.query.postId) {
    // 수정 모드인 경우
    fetchPostDetails(route.query.postId); //게시글 세부 정보 가져오기
  }
  
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