<template>
    <button @click="GoBack"><</button>
    <div class="list">
        <div class="account-info">
            <img :src="`/images/bank/${bankName}.png`" alt="Bank Logo" class="bank-logo">
            <div class="account-details">
                <p>{{ accountName }}</p>
                <p>{{ accountNum }}</p>
                <p>{{ accountAmount }}</p>
            </div>
        </div>

        <div v-for="(group, index) in groupedTransactions" :key="index" class="transaction-group">
            <h4>{{ group.date }}</h4>
            <div v-for="(transaction, tIndex) in group.transactions" :key="tIndex" class="transaction-item">
                <div class="transaction-content">
                    <p class="transaction-description">{{ transaction.content }}</p>
                    <div class="transaction-amounts">
                        <p class="transaction-amount">{{ transaction.amount }}</p>
                        <p class="transaction-left-amount">{{ transaction.leftAmount }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { reactive, onMounted, computed } from 'vue';
import HomeApi from '@/api/HomeApi';

const route = useRoute();
const router = useRouter();

const accountNum = route.query.accountNum;  // 쿼리에서 계좌 번호를 받아옴
console.log(accountNum);
const accountName = 'test';
const bankName = 'KB국민';
const accountAmount = '6000000';
const transactions = reactive([
    {
        date: '09.12',
        content: '깍뚝',
        amount: '-600000',
        leftAmount: '600000'
    },
    {
        date: '09.12',
        content: '월급',
        amount: '400000',
        leftAmount: '1200000'
    },
    {
        date: '09.11',
        content: '보너스',
        amount: '400000',
        leftAmount: '1700000'
    },
    {
        date: '09.10',
        content: 'GS 25',
        amount: '-300000',
        leftAmount: '1300000'
    },
]);

const groupedTransactions = computed(() => {
    const groups = {};
    transactions.forEach(transaction => {
        if (!groups[transaction.date]) {
            groups[transaction.date] = [];
        }
        groups[transaction.date].push(transaction);
    });
    return Object.keys(groups).map(date => ({
        date,
        transactions: groups[date],
    }));
});

const getAccountInfo = async () => {
    try {
        const accountInfo = await HomeApi.transactionList(accountNum);
        console.log(accountInfo);
        accountInfo.forEach(account => {
            transactions.push({
                date: account.date,  // 백에서 받는 값 형식에 맞게 수정 필요
                content: account.content,
                amount: account.amount,
                leftAmount: account.leftAmount
            });
        });
    } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
    }
};

const GoBack = () => {
    router.push('/home/account');
};

onMounted(() => {
    // getAccountInfo(); // 필요 시 호출
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
