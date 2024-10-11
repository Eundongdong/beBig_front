<template>
  <div class="page">
    <header class="w-full flex justify-between items-center mb-6 px-2 relative">
      <button class="text-lg" @click="goBack">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <span class="font-bold text-base absolute left-1/2 transform -translate-x-1/2">내 계좌</span>
    </header>

    <div class="section-style mx-4 lg:mx-20">
      <div class="flex items-center my-4">
        <img :src="`/images/bank/${bankName}.png`" alt="Bank Logo" class="w-24" />
        <div class="flex flex-col justify-between ml-4 flex-grow space-y-1">
          <p class="text-xs font-bold">{{ bankNameKR }}</p>
          <p class="text-xs">{{ accountName }}</p>
          <p class="text-xl font-bold">{{ accountAmount.toLocaleString() }} 원</p>
          <p class="text-xs">{{ accountNum }}</p>
        </div>
      </div>

      <div class="mt-10">
        <div v-for="(group, index) in groupedTransactions" :key="index" class="mt-4 bg-white p-4 rounded-lg shadow">
          <p class="font-semibold mb-2 border-b border-gray pb-2 pl-2">{{ group.transactionDate }}</p>

          <div
            v-for="(transaction, tIndex) in group.transactions"
            :key="tIndex"
            class="flex justify-between items-center py-2 mx-4"
            :class="tIndex < group.transactions.length - 1 ? 'border-b border-gray' : ''"
          >
            <div class="flex justify-between w-full">
              <p class="text-base font-semibold mt-1">{{ transaction.transactionVendor }}</p>
              <div class="text-right my-2">
                <p
                  :class="{
                    'text-red-500': transaction.transactionType === '출금',
                    'text-blue-500': transaction.transactionType !== '출금',
                  }"
                  class="text-sm font-semibold mb-1"
                >
                  {{ transaction.transactionAmount.toLocaleString() }} 원
                </p>
                <p class="text-xs">잔액 {{ transaction.transactionBalance.toLocaleString() }} 원</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { reactive, computed, ref, onMounted, onBeforeUnmount } from 'vue';
import HomeApi from '@/api/HomeApi';

const route = useRoute();
const router = useRouter();

const accountNum = route.query.accountNum; // 쿼리에서 계좌 번호를 받아옴
const accountName = ref('');
const bankName = ref('');
const bankNameKR = ref('');
const accountAmount = ref('');
const transactions = reactive([]);

//페이지네이션
const currentPage = ref(0); // 현재 페이지 번호
const pageSize = ref(10); // 한 번에 가져올 거래 내역 개수
const totalPage = ref(1); // 전체 페이지 수 (필요시 추가)
const isFetching = ref(false); // 데이터 로딩 중인지 상태 확인
const hasMore = ref(true); // 추가 데이터가 있는지 여부

const groupedTransactions = computed(() => {
  const groups = {};
  transactions.forEach((transaction) => {
    if (!groups[transaction.transactionDate]) {
      groups[transaction.transactionDate] = [];
    }
    groups[transaction.transactionDate].push(transaction);
  });
  return Object.keys(groups).map((transactionDate) => ({
    transactionDate,
    transactions: groups[transactionDate],
  }));
});

const getAccountInfo = async () => {
  try {
    if (isFetching.value || currentPage.value > totalPage.value) return;

    isFetching.value = true;

    const accountInfo = await HomeApi.transactionList(
      accountNum,
      pageSize.value,
      currentPage.value
    );
    //console.log("현재 페이지:", currentPage.value, "offset:", (currentPage.value) *pageSize.value);
    //console.log("받은 데이터:", accountInfo);


    bankNameKR.value = accountInfo.bankName;
    bankName.value = changeName(accountInfo.bankName);
    accountName.value = accountInfo.accountName;

    // 첫 번째 페이지일 경우에만 잔액을 설정
    if (currentPage.value === 0) {
      accountAmount.value = accountInfo.transactions[0]?.transactionBalance;
    }

    // 새로운 거래 내역을 기존 거래 내역에 추가
    accountInfo.transactions.forEach((transaction) => {
      transaction.transactionDate = new Date(transaction.transactionDate).toLocaleDateString();
      transactions.push(transaction);
    });

    // 전체 페이지 수 계산 (필요시)
    totalPage.value = accountInfo.totalPage || 1;

  } catch (error) {
     console.error('API 호출 중 오류 발생:', error);
  } finally {
    isFetching.value = false;
  }
};

const changeName = (name) => {
  if (name == '경남은행') {
    return 'Gyeongnam';
  } else if (name == '광주은행') {
    return 'Gwangju';
  } else if (name == '부산은행') {
    return 'Busan';
  } else if (name == '산업은행') {
    return 'IndustrialBank';
  } else if (name == '새마을금고은행') {
    return 'SaemaulGeumgo';
  } else if (name == '수협은행') {
    return 'Suhyup';
  } else if (name == '신한은행') {
    return 'Shinhan';
  } else if (name == '신협은행') {
    return 'Shinhyup';
  } else if (name == '씨티은행') {
    return 'Citi';
  } else if (name == '우리은행') {
    return 'Woori';
  } else if (name == '우체국은행') {
    return 'PostOfficeBank';
  } else if (name == '전북은행') {
    return 'Jeonbuk';
  } else if (name == '제주은행') {
    return 'Jeju';
  } else if (name == '카카오뱅크') {
    return 'KakaoBank';
  } else if (name == '하나은행') {
    return 'Hana';
  } else if (name == '기업은행') {
    return 'IBK';
  } else if (name == 'IM') {
    return 'IM';
  } else if (name == 'K뱅크') {
    return 'KBank';
  } else if (name == '국민은행') {
    return 'KB';
  } else if (name == '농협은행') {
    return 'NH';
  }
};

const goBack = () => {
  router.push('/home/account');
};

const loadMoreTransactions = async () => {
  if (isFetching.value || currentPage.value >= totalPage.value) return;

  currentPage.value++; // 다음 페이지로 이동
  //console.log("페이지 증가:", currentPage.value, "offset:", (currentPage.value - 1) * pageSize.value);
  await getAccountInfo(); // 다음 페이지의 거래 내역을 불러옴
};

// 거래 내역을 불러오는 함수
const fetchTransactions = async () => {
  if (isFetching.value || !hasMore.value) return; // 이미 로딩 중이거나 더 이상 불러올 데이터가 없으면 중단

  isFetching.value = true; // 로딩 상태로 변경

  try {
    const data = await HomeApi.transactionList(accountNum.value, pageSize.value, (currentPage.value - 1) * pageSize.value);

    if (data.transactions.length < pageSize.value) {
      hasMore.value = false; // 추가 데이터가 더 이상 없으면 false로 설정
    }

    transactions.value = [...transactions.value, ...data.transactions]; // 기존 거래 내역에 새로 받은 데이터를 추가
    currentPage.value += 1; // 페이지 증가
  } catch (error) {
    console.error("거래 내역 로드 중 오류:", error);
  } finally {
    isFetching.value = false; // 로딩 상태 해제
  }
};

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = window.innerHeight || document.documentElement.clientHeight;

  if (scrollY + clientHeight >= scrollHeight - 100) {
    loadMoreTransactions();
  }
};


onMounted(() => {
  getAccountInfo(); // 필요 시 호출
  fetchTransactions(); // 첫 번째 데이터를 로드
  window.addEventListener('scroll', handleScroll); // 스크롤 이벤트 추가
});

// 컴포넌트가 해제될 때 스크롤 이벤트를 제거
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll); // 스크롤 이벤트 제거
});
</script>

<style scoped></style>
