<template>
    <ul class="footer">
        <li>
            <button @click="goCommunity">
                <div class="icon-wrapper">
                    <i class="fas fa-file-lines"></i>
                </div>
                <span>커뮤니티</span> <!-- 아이콘 아래 텍스트 -->
            </button>
        </li>
        <li>
            <button @click="goHome">
                <div class="icon-wrapper">
                    <i class="fas fa-home"></i>
                </div>
                <span>홈</span>
            </button>
        </li>
        <li>
            <button @click="goAsset">
                <div class="icon-wrapper">
                    <i class="fas fa-chart-simple"></i>
                </div>
                <span>자산 분석</span>
            </button>
        </li>
        <li>
            <button @click="goMypage">
                <div class="icon-wrapper">
                    <i class="fas fa-user"></i>
                </div>
                <span>마이페이지</span>
            </button>
        </li>
    </ul>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    const router = useRouter();

    //라우터 이동

    //커뮤니티 이동
    const goCommunity= () => {
        router.push({ name: 'communityList' })
    }
    //메인 이동
    const goHome = () => {
        router.push({ name: 'main' })
    }
    //자산분석 이동
    const goAsset= ()=>{
        router.push({ name: 'asset' })
    }
    //마이페이지 이동
    const goMypage= ()=>{
        router.push({name: 'mypage'})
    }
</script>




<style scoped>
* {
    box-sizing: border-box;
}

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px; /* 푸터 높이 조정 */
    background-color: #f0f0f0;
    border-radius: 20px 20px 0 0; /* 상단 모서리 둥글게 */
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px;
    z-index: 1000; /* 다른 요소 위로 */
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); /* 상단 그림자 효과 */
}

ul {
    list-style-type: none;
    display: flex;
    justify-content: space-around;
    padding: 0;
    margin: 0;
    width: 100%;
}

li {
    flex: 1;
    text-align: center;
}

button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
}

button:focus {
    outline: none;
}

i {
    display: block;
    margin-bottom: 5px; /* 아이콘과 텍스트 간격 */
}

span {
    font-size: 12px; /* 설명 텍스트 크기 */
    color: #333;
}
</style>