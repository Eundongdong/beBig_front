<template>
    <button @click="GoBack"><</button>
    <div class="list">
        <div class="account-info">
            <img :src="`../../../public/images/bank/${bankName}.png`" alt="Bank Logo" class="bank-logo">
            <div class="account-details">
                <p>{{ accountName }}</p>
                <p>{{ accountNum }}</p>
                <p>{{ accountAmount }}</p>
            </div>
        </div>

        <div v-for="(group, index) in groupedTransactions" :key="index" class="transaction-group">
            <h4>{{ group.transactionDate}}</h4>
            <div v-for="(transaction, tIndex) in group.transactions" :key="tIndex" class="transaction-item">
                <div class="transaction-content">
                    <p class="transaction-description">{{ transaction.transactionVendor}}</p>
                    <div class="transaction-amounts">
                        <p 
                            class="transaction-amount" 
                            :style="{ color: transaction.transactionType === '출금' ? 'red' : 'blue' }">
                            {{ transaction.transactionAmount }}
                        </p>
                        <p class="transaction-left-amount">{{ transaction.transactionBalance}}</p>
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

const accountNum = route.query.accountNum;  // 쿼리에서 계좌 번호를 받아옴
console.log(accountNum);
const accountName = ref('');
const bankName = ref('');
const accountAmount = ref('');
const transactions = reactive([]);

const groupedTransactions = computed(() => {
    const groups = {};
    transactions.forEach(transaction => {
        if (!groups[transaction.transactionDate]) {
            groups[transaction.transactionDate] = [];
        }
        groups[transaction.transactionDate].push(transaction);
    });
    return Object.keys(groups).map(transactionDate => ({
        transactionDate,
        transactions: groups[transactionDate],
    }));
});

const getAccountInfo = async () => {
    try {
        const accountInfo = await HomeApi.transactionList(accountNum);
        bankName.value = accountInfo.bankName;
        accountName.value = accountInfo.accountName;
        for(let i=0;i<accountInfo.transactions.length;i++){
            const transaction = accountInfo.transactions[i];
            // 타임스탬프를 날짜 형식으로 변환하여 transactionDate에 할당
            transaction.transactionDate = new Date(transaction.transactionDate).toLocaleDateString();
            transactions[i] = transaction; // 변환된 transaction을 배열에 추가
        }
        console.log(transactions);
        accountAmount.value = transactions[0].transactionBalance;

    } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
    }
};

const GoBack = () => {
    router.push('/home/account');
};

onMounted(() => {
    getAccountInfo(); // 필요 시 호출
});
</script>

<style scoped>
.list {
    border-radius: 8px; /* 모서리 둥글게 */
    background-color: #f3f3f3; /* 배경색 */
    padding: 16px; /* 패딩 추가 */
    margin-bottom: 16px; /* 아래 여백 추가 */
}

.account-info {
    display: flex; /* 가로 정렬 */
    align-items: center; /* 세로 중앙 정렬 */
}

.bank-logo {
    width: 40px; /* 로고 크기 조정 */
    height: 40px; /* 로고 크기 조정 */
    margin-right: 16px; /* 로고와 세부정보 간격 */
}

.account-details {
    flex-grow: 1; /* 오른쪽으로 가게 함 */
    color: black; /* 글씨 색상 검정으로 변경 */
}

.transaction-group {
    margin-top: 16px; /* 거래 그룹 간격 */
    width: 100%; /* 너비를 100%로 설정 */
}

.transaction-item {
    padding: 8px; /* 거래 항목 간격 */
    margin-top: 8px; /* 거래 항목 간격 */
    display: flex; /* 플렉스 박스로 설정 */
    justify-content: space-between; /* 양쪽 정렬 */
    color: black; /* 글씨 색상 검정으로 변경 */
}

.transaction-content {
    display: flex; /* 플렉스 박스 설정 */
    justify-content: space-between; /* 양쪽 정렬 */
    width: 100%; /* 너비 100%로 설정 */
}

.transaction-amounts {
    text-align: right; /* 오른쪽 정렬 */
}

.transaction-group h4,
.transaction-item p {
    color: black; /* 글씨 색상 검정으로 변경 */
}
</style>
