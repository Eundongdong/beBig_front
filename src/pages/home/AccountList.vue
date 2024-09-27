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
                <p>{{ account.accountNum }}</p>
                <p>{{ account.amount }}</p>
            </div>
            <button class="details-button" @click="goBankDetail(account.accountNum)">></button>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HomeApi from '@/api/HomeApi';
const router = useRouter();

const totalAmount = 1234000; // 총 자산 예시
const accountList = reactive([
    {
        bankName: '신한',
        accountName: '블라블라',
        accountNum: '0123045687',
        amount: '1,234,000',
    },
    {
        bankName: 'KB국민',
        accountName: '블라블라',
        accountNum: '9851355687',
        amount: '5,678,000',
    },
    {
        bankName: '하나',
        accountName: '블라블라',
        accountNum: '012304354587',
        amount: '2,345,000',
    },
]);

const getList = async() =>{
    try{
        const accounts = await HomeApi.accountList();
        console.log(accounts);
        accounts.forEach(account => {
            accountList.push({
            bankName: account.bankName,  //백에서 받는 값 형식에 맞게 수정필요
            accountName: account.accountName, 
            accountNum: account.accountNum,
            amount: account.amount
            });
        });

        // 총 자산 계산
        totalAmount.value = accounts.reduce((sum, account) => {
            // amount 값을 문자열에서 숫자로 변환 (예: "1,234,000원" -> 1234000)
            const amount = parseInt(account.amount.replace(/[^0-9]/g, ''), 10);
            return sum + (isNaN(amount) ? 0 : amount); // NaN 방지
        }, 0);

    }catch(error){
        console.error('API 호출 중 오류 발생:', error);
    }
}


const GoBack = () => {
    router.push('/home');
};
const goBankDetail = (accountNum) => {
    router.push({
        path: '/home/account-detail',
        query: {accountNum: accountNum} // 계좌 이름을 쿼리 파라미터로 전달
    });
};

onMounted(() => {
        //getList();
    });

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
