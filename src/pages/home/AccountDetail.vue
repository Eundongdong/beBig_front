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
import { reactive, onMounted, computed, ref } from 'vue';
import HomeApi from '@/api/HomeApi';

const route = useRoute();
const router = useRouter();

const accountNum = route.query.accountNum; // 쿼리에서 계좌 번호를 받아옴
const accountName = ref('');
const bankName = ref('');
const accountAmount = ref('');
const transactions = reactive([]);

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
    const accountInfo = await HomeApi.transactionList(accountNum);
    bankName.value = changeName(accountInfo.bankName);
    accountName.value = accountInfo.accountName;
    for (let i = 0; i < accountInfo.transactions.length; i++) {
      const transaction = accountInfo.transactions[i];
      // 타임스탬프를 날짜 형식으로 변환하여 transactionDate에 할당
      transaction.transactionDate = new Date(transaction.transactionDate).toLocaleDateString();
      transactions[i] = transaction; // 변환된 transaction을 배열에 추가
    }
    // console.log(transactions);
    accountAmount.value = transactions[0].transactionBalance;
  } catch (error) {
    //  console.error('API 호출 중 오류 발생:', error);
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

onMounted(() => {
  getAccountInfo(); // 필요 시 호출
});
</script>

<style scoped></style>
