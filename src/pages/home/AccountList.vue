<template>
    <div class="page">
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
            <img :src="`/images/bank/${account.bankName}.png`" alt="Bank Logo" class="bank-logo">
            <div class="account-details">
                <p>{{ account.accountName }}</p>
                <p>{{ account.accountNum }}</p>
                <p>{{ account.transactionBalance}}</p>
            </div>
            <button class="details-button" @click="goBankDetail(account.accountNum)">></button>
        </div>
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
        for(let i=0;i<response.length;i++){
            accountList[i] = response[i];
            const newName = changeName(accountList[i].bankName);
            accountList[i].bankName = newName;
        }
      //  console.log(accountList);
        // 총 자산 계산
        const total = accountList.reduce((acc, account) => acc + account.transactionBalance, 0);
        totalAmount.value = total;

    }catch(error){
  //      console.error('API 호출 중 오류 발생:', error);
    }
}
const changeName = (name) => {
    if (name == '경남은행') {
        return "Gyeongnam";
    } else if (name == '광주은행') {
        return "Gwangju";
    } else if (name == '부산은행') {
        return "Busan";
    } else if (name == '산업은행') {
        return "IndustrialBank";
    } else if (name == '새마을금고은행') {
        return "SaemaulGeumgo";
    } else if (name == '수협은행') {
        return "Suhyup";
    } else if (name == '신한은행') {
        return "Shinhan";
    } else if (name == '신협은행') {
        return "Shinhyup";
    } else if (name == '씨티은행') {
        return "Citi";
    } else if (name == '우리은행') {
        return "Woori";
    } else if (name == '우체국은행') {
        return "PostOfficeBank";
    } else if (name == '전북은행') {
        return "Jeonbuk";
    } else if (name == '제주은행') {
        return "Jeju";
    } else if (name == '카카오뱅크') {
        return "KakaoBank";
    } else if (name == '하나은행') {
        return "Hana";
    } else if (name == '기업은행') {
        return "IBK";
    } else if (name == 'IM') {
        return "IM";
    } else if (name == 'K뱅크') {
        return "KBank";
    } else if (name == '국민은행') {
        return "KB";
    } else if (name == '농협은행') {
        return "NH";
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
