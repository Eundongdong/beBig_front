<template>
    <div class="result-container">
      <h1 class="finType-title">{{ finTypeTitle }}</h1>
      <h2 class="finType-subtitle">{{ finTypeSubtitle }}</h2>
      <img :src="finTypeImage" alt="finType 이미지" class="finType-image" />
      <div class="finType-description">
        <div v-for="line in description" :key="line">
            <p>{{ line }}</p>
        </div>
        <ul>
          <li v-for="advice in advices" :key="advice">{{ advice }}</li>
        </ul>
      </div>
      <button class="button" @click="goBack">홈으로 돌아가기</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useHomeStore } from '@/stores/home';
  
  const router = useRouter();
  const homeStore = useHomeStore();
//   const finType = ref(route.params.result || '0'); // result 파라미터에서 finType을 가져옴
  const finType = ref(''); // 테스트를 위해 finType을 2로 고정
  finType.value = String(homeStore.getUserFintype());

  console.log(finType);
  
  // finType에 따라 이미지, 제목, 설명 설정
  const finTypeImage = ref('');
  const finTypeTitle = ref('');
  const finTypeSubtitle = ref('');
  const description = ref('');
  const advices = ref([]);
  
  const getFinTypeData = (finType) => {
    switch (finType) {
      case '1':
        return {
          title: '꿀벌',
          subtitle: '계획적 목표달성형',
          image: '/images/1.png',
          description: [
            '목표를 가지고 돈을 모은 뒤 한번에 큰 소비를 하시는군요!',
            '꿀벌은 목적을 가지고 효율적으로 꿀을 모읍니다. 꿀벌처럼 체계적이고 목표 지향적인 재정 관리 능력을 갖추고 있습니다. 하지만 너무 목표에만 집중하면 삶의 작은 기쁨들을 놓칠 수 있습니다.'
        ],
            advices: [
          '큰 목표를 이루는 과정에서 스스로에게 작은 보상을 주는 습관을 가져보세요. 이는 꾸준한 동기 부여에 도움이 될 수 있습니다.',
            '예상치 못한 지출에 대비해 여유를 두는 것도 좋습니다. 지나치게 세부적인 계획은 갑작스러운 상황에서 어려움을 겪을 수 있습니다.'
          ]
        };
      case '2':
        return {
          title: '호랑이',
          subtitle: '비유하면 과감형',
          image: '/images/2.png',
          description: [
            '시원시원하게 돈을 쓰지만 뚜렷한 목적은 없는 편이시군요!',
            '호랑이는 자신이 필요한 순간에 아주 과감하게 움직입니다. 필요하다고 느낄 때는 주저 없이 큰 소비를 결단하지만, 때때로 과감한 지출이 재정 계획을 흔들 수 있습니다.'
        ],
          advices: [
            '지출 후에는 예산을 다시 점검하고, 저축 계획을 수정하는 습관을 들이세요. 과감한 소비도 좋지만, 균형을 맞추는 것이 중요합니다.',
            '소비 충동이 생길 때는 잠시 멈추고, 그 지출이 장기적으로 어떤 가치를 줄지 고민해 보는 시간을 가져보세요.'
          ]
        };
      case '3':
        return {
          title: '다람쥐',
          subtitle: '절약형 실속파',
          image: '/images/3.png',
          description: [
            '먼 훗날의 미래를 위해 상당히 아껴쓰는 편이시군요!',
            '다람쥐는 겨울을 대비해 도토리를 많이 모으지만, 너무 많이 쌓아 두면 결국 사용하지 못할 수 있습니다 돈을 모으는 데 집중하지만, 필요한 때에 지출하지 않아 기회를 놓칠 수도 있습니다.'
        ],
            advices: [
            '절약도 중요하지만, 건강이나 삶의 질을 높이기 위한 지출을 아끼지 마세요. 필요할 때 자신을 위한 소비를 주저하지 않는 습관을 길러보세요.',
            '작은 지출을 아끼는 것보다는 불필요한 낭비를 줄이고 가치 있는 곳에 투자하는 습관을 가져보세요.'
          ]
        };
      case '4':
        return {
          title: '나무늘보',
          subtitle: '느긋한 저축형',
          image: '/images/4.png',
          description: ['나무늘보는 돈을 모으는 데 별로 신경 쓰지 않고, 느긋하게 소비합니다.',
          '뚜렷한 목적 없이 일단 돈을 모아놓는 당신!'
        ],
          advices: [
            '저축도 좋지만, 필요한 지출을 통해 삶의 질을 높이는 것 역시 중요합니다. 돈을 쓸 항목을 미리 정해두고, 의미 있는 지출을 즐기는 습관을 만들어 보세요.',
            '투자에 대해 조금 더 관심을 가져보는 것도 좋습니다. 안정적인 저축만으로는 자산을 불리기 어려울 수 있습니다.'
          ]
        };
      default:
        return {
          title: '알 수 없음',
          subtitle: '설문 결과를 찾을 수 없습니다.',
          image: '/images/0.png',
          description: ['설문 결과를 확인할 수 없습니다. 다시 시도해주세요.'],
          advices: []
        };
    }
  };
  
  // 페이지가 마운트될 때 finType에 맞는 데이터를 설정
  onMounted(() => {
    const finTypeData = getFinTypeData(finType.value);
    finTypeImage.value = finTypeData.image;
    finTypeTitle.value = finTypeData.title;
    finTypeSubtitle.value = finTypeData.subtitle;
    description.value = finTypeData.description;
    advices.value = finTypeData.advices;
  });
  
  // 홈으로 돌아가는 함수
  const goBack = () => {
    router.push({ name: 'main' });
  };
  </script>
  
  <style scoped>
  .result-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f9f9f9;
    height: 100vh;
  }
  
  .finType-title {
    font-size: 24px;
    color: #1a73e8;
    margin-bottom: 10px;
    text-align: center;
  }
  
  .finType-subtitle {
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .finType-image {
    width: 150px;
    height: auto;
    margin-bottom: 20px;
  }
  
  .finType-description {
    text-align: left;
    margin-bottom: 30px;
    max-width: 400px;
  }
  
  .finType-description p {
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
  }
  
  .finType-description ul {
    list-style-type: disc;
    margin-left: 20px;
  }
  
  .finType-description ul li {
    font-size: 14px;
    color: #777;
    margin-bottom: 5px;
  }
  
  .back-button {
    background-color: #1a73e8;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .back-button:hover {
    background-color: #1558c0;
  }
  </style>