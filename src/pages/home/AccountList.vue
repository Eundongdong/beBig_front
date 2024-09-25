<template>
    <button @click="GoBack"><</button>
    <div class="asset">
        <ul>
            <li class="asset_total">
                <h3>총 자산</h3>
            </li>
            <li class="asset-sum">
                <h2>{{ totalAmount }}원</h2>
            </li>
        </ul>
        <!-- 계좌 목록 출력 -->
        <div v-for="(account, index) in accountList" :key="index" class="account-info">
            <img :src="`../../../public/images/bank/${account.bankName}.png`" alt="Bank Logo" class="bank-logo">
            <div class="account-details">
                <p>{{ account.accountName }}</p>
                <p>{{ account.amount }}</p>
            </div>
            <button class="details-button" @click="goBankDetail(accountList)">></button>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const totalAmount = 1234000; // 총 자산 예시
const accountList = reactive([
    {
        bankName: '신한',
        accountName: '블라블라',
        amount: '1,234,000',
    },
    {
        bankName: 'KB국민',
        accountName: '블라블라',
        amount: '5,678,000',
    },
    {
        bankName: '하나',
        accountName: '블라블라',
        amount: '2,345,000',
    },
]);

const GoBack = () => {
    router.push('/home');
};
const goBankDetail = (accountList) => {
    router.push({
        path: '/home/account-detail',
        query: { accountName: accountList.bankName } // 계좌 이름을 쿼리 파라미터로 전달
    });
};
</script>

<style scoped>
ul {
        list-style-type: none;
    }
.asset {
    background-color: #f3f3f3;
    padding: 10px;
    border-radius: 10px;
}

.asset_total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: black;
}

.add-bank-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
}

.account-info {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.bank-logo {
    width: 50px;
    height: 50px;
    margin-right: 15px;
}

.account-details {
    flex-grow: 1;
    color: black;
}
.asset-sum{
    color:black;
}
</style>
