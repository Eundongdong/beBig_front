<template>
    <ul>
        <li>
            <button @click="GoCommunity">
                <img src="../../public/images/community.png">
            </button>
            <button @click="GoHome">
                <img src="../../public/images/home.png">
            </button>
            <button @click="GoAsset">
                <img src="../../public/images/asset.png">
            </button>
            <button @click="GoMypage">
                <img src="../../public/images/user.png">
            </button>
        </li>
    </ul>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    const router = useRouter();

    /////라우터 이동
    //커뮤니티 이동
    const GoCommunity= () => {
        router.push('./community')
    }
    //메인 이동
    const GoHome = () => {
        router.push('./home')
    }
    //자산분석 이동
    const GoAsset= ()=>{
        router.push('./asset')
    }
    //마이페이지 이동
    const GoMypage= ()=>{
        router.push('./mypage')
    }
</script>

<style scoped>
    *{
        box-sizing: border-box;
        width: 100%;
    }
    ul{
        list-style-type: none;
    }
    button{
        width: 25%;
    }
    img{
        height: 100%;
        width: 100;
    }
</style>