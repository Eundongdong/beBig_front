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
                <p>{{ account.transactionBalance}}</p>
            </div>
            <button class="details-button" @click="goBankDetail(account.accountNum)">></button>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HomeApi from '@/api/HomeApi';
const router = useRouter();

const totalAmount = ref(''); // 총 자산 예시
const accountList = reactive([]);

const getList = async() =>{
    try{
        const response = await HomeApi.accountList();
        console.log(response);
        for(let i=0;i<response.length;i++){
            accountList[i] = response[i];
        }
        console.log(accountList);
        // 총 자산 계산
        const total = accountList.reduce((acc, account) => acc + account.transactionBalance, 0);
        totalAmount.value = total;

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
        getList();
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
