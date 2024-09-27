<template>
    <div class="category">
        <ul>
            <li>
                <h1 class="name">{{user.userName}}님,<br> 안녕하세요</h1>
                <button class="category_button" @click="GoSurvey">
                    <img class="category_img" :src="`../../../public/images/${user.finTypeCode}.png`">
                    <h5 class="category_tag">{{ user.finTypeCode === '0' ? '유형검사 하러 가기' : '내 유형 보기' }}</h5>
                </button>
            </li>
        </ul>
    </div>

    <!-- 모달이 활성화될 경우 표시 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModalOnOverlay">
      <div class="modal" @click.stop>
        <SurveyResult/>
        <button @click="closeModal" class="modal-close-button">닫기</button>
      </div>
    </div>

    <div class="asset">
        <ul>
            <li class="asset_total">
                <h3>총 자산</h3>
                <button class="add-bank-button" @click="GoAddBank" v-if="accountList.length != 0">계좌 추가하기</button>
            </li>
            <li class="asset-sum">
                <h2>{{totalAmount}}원</h2>
            </li>
            <!-- accountList가 비어있을 경우 계좌 연결하기 버튼 표시 -->
            <li v-if="accountList.length == 0" class="connect-bank">
                <button class="connect-bank-button" @click="GoAddBank">계좌 연결하기</button>
            </li>
        </ul>
        <!-- 계좌 목록 출력 -->
        <div v-for="(account, index) in accountList" :key="index" class="account-info">
            <img :src="`../../../public/images/bank/${account.bankName}.png`" alt="Bank Logo" class="bank-logo">
            <div class="account-details">
                <p>잔액: {{ account.amount }}</p>
            </div>
            <button v-if="index ==0" class="details-button" @click="goToAccountDetails(account)">></button>
        </div>
    </div>
    <div v-else>
      <h2>
        {{ mission.MonthMission }}
        <button
          :class="{
            completed: !mission.MonthMissionType,
          }"
          :disabled="!mission.MonthMissionType"
          @click="completeMission('MonthMission')"
        >
          {{
            mission.MonthMissionType
              ? '완료'
              : '완료됨'
          }}
        </button>
      </h2>
      <h2>
        {{ mission.dailyMission1 }}
        <button
          :class="{
            completed: !mission.dailyMission1Type,
          }"
          :disabled="!mission.dailyMission1Type"
          @click="
            completeMission('dailyMission1')
          "
        >
          {{
            mission.dailyMission1Type
              ? '완료'
              : '완료됨'
          }}
        </button>
      </h2>
      <h2>
        {{ mission.dailyMission2 }}
        <button
          :class="{
            completed: !mission.dailyMission2Type,
          }"
          :disabled="!mission.dailyMission2Type"
          @click="
            completeMission('dailyMission2')
          "
        >
          {{
            mission.dailyMission2Type
              ? '완료'
              : '완료됨'
          }}
        </button>
      </h2>
    </div>
  </div>
</template>

<script setup>
    import HomeApi from "@/api/HomeApi";
    import { ref, reactive, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import SurveyResult from "./SurveyResult.vue";

    const user = reactive({
        userName: '',
        finTypeCode: ''  //2로도 바꿔보세요.
    });

    const accountList = reactive([
        {
            bankName: '신한',
            amount: '1,234,000원',
        },
        {
            bankName: 'KB국민',
            amount: '5,678,000원',
        },
    ]);

    const totalAmount = reactive('1234');
    const mission = reactive({
        MonthMission: 'aaa',
        dailyMission1: 'bbb',
        dailyMission2: 'ccc',
        dailyMission1Type: true,
        dailyMission2Type: false,
        MonthMissionType: true,
    });

// 사용자 정보를 가져오는 함수
const getUser = async () => {
  try {
    const userInfo = await HomeApi.getMyInfo(); // /home/info 호출
    console.log(userInfo);  // userInfo 값 확인
    user.userName = userInfo.userName;
    user.finTypeCode = userInfo.finTypeCode; // 필요한 정보가 어떤건지 확인 필요
  } catch (error) {
    console.error('사용자 정보 가져오는 함수 API 호출 중 오류 발생:', error);
  }
};

    const getAsset = async () => {
        try {
            const userAsset = await HomeApi.accountList();
            console.log(userAsset);
            totalAmount.value = userAsset.totalAsset; // API 데이터 형식에 맞게 수정 필요
        } catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
    };

    const getMission = async () => {
        try {
            const userMission = await HomeApi.missionList();
            console.log(userMission);
            Object.assign(mission, userMission); // mission 객체에 API 응답 값 설정
        } catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
    };

    onMounted(() => {
         getUser();
        // getAsset();
        // getMission();
    });

    const router = useRouter();

    const GoAddBank = () => {
        router.push('/home/bank');
    };

    const GoSurvey = () => {
        // userType이 '0'일 때는 /home/survey-start로 이동
        if (user.userType === '0') {
            router.push('/home/survey-start');
        } else {
            // 그 외의 경우에는 모달을 띄움
            showModal.value = true;
        }
    };

        // 모달 닫기 함수
    const closeModal = () => {
    showModal.value = false;
    };
    // 모달 외부 클릭 시 닫기 함수
    const closeModalOnOverlay = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

        // '미션 보러 가기' 버튼 클릭 시 Mission 페이지로 이동
    const goToMission = () => {
    router.push({ name: 'mission' });
    };

    const completeMission = (missionType) => {
        if (missionType === 'MonthMission') {
            mission.MonthMissionType = false;
        } else if (missionType === 'dailyMission1') {
            mission.dailyMission1Type = false;
        } else if (missionType === 'dailyMission2') {
            mission.dailyMission2Type = false;
        }
    };

    const goToAccountDetails = (account) => {
        // /home/account 경로로 이동
        router.push('/home/account');
    };

    // 모달 활성화 상태 변수
    const showModal = ref(false);

</script>

<style scoped>
ul {
  list-style-type: none;
}

.category,
.asset,
.mission {
  width: 100%;
  margin-bottom: 10%;
  background-color: #f3f3f3;
  border-radius: 10px;
  padding: 10px;
  border: none;
}

.category_button,
.name {
  width: 40%;
}

h3 {
  color: black;
}

.name {
  width: 100%;
  color: black;
}

.category_img {
  width: 100%;
}

.category_tag {
  width: 100%;
  color: black;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.connect-bank-button {
  width: 100%;
  height: 30%;
  background-color: #ffffff;
  border: none;
  border-radius: 10px;
  margin-top: auto;
  text-align: center;
  color: black;
}

.add-bank-button {
  background-color: #f3f3f3;
  border: none;
  border-radius: 10px;
  padding: 10px;
  color: black;
}

.account-details {
  color: black;
  flex-grow: 1;
}

.connect-bank {
  width: 100%;
  display: flex;
  justify-content: center;
}

.asset_total {
  width: 100%;
  height: 30%;
}

.asset-sum {
  width: 100%;
  height: 20%;
  color: black;
}

.mission h3,
.mission h2 {
  color: black;
}

.mission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mission-title {
  margin: 0;
}

.mission-button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.mission-button:hover {
  background-color: #0056b3;
}

    /* 계좌 정보와 이미지 좌우 배치 */
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
    }

    /* 계좌 상세 페이지로 이동하는 버튼 스타일 */
    .details-button {
        background-color: transparent;
        border: none;
        font-size: 24px;
        color: black;
        cursor: pointer;
    }

    /* 완료된 버튼 스타일 */
    button.completed {
        background-color: #d3d3d3;
        color: #a9a9a9;
        cursor: not-allowed;
    }

    /* details-button을 계좌 정보 옆에 배치 */
    .account-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

/* 모달 관련 스타일 */
/* 화면 전체를 덮는 반투명한 배경 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 다른 요소 위에 표시 */
}

/* 모달 창 스타일 */
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 100%;
  max-height: 80vh; /* 모달 창의 최대 높이 제한 */
  overflow: auto; /* 스크롤 활성화 */
  z-index: 1001;
}

/* 닫기 버튼 스타일 */
.modal-close-button {
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.modal-close-button:hover {
  background-color: #0056b3;
}
</style>
