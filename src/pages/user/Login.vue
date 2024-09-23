    <template>
        <div class="Page">
            <div class="Logo">
                <h1>beBIG</h1>
            </div>
            <div class="Input">
                <ul>
                    <li>
                        <h3>아이디</h3>
                        <input type="text" v-model="loginUser.id" placeholder="Enter your ID"/>
                    </li>
                    <li>
                        <h3>비밀번호</h3>
                        <input type="password" v-model="loginUser.password" placeholder="Enter your password"/>
                    </li>
                    <li>
                        <button class="button" @click="GoSignup">회원가입</button>
                        <button class="button" :disabled="disableSubmit" @click="login">로그인</button>
                    </li>
                    <li>
                        <button class="button" @click="GoFindId">아이디 찾기</button>
                        <button class="button" @click="GoFindPwd">비밀번호 찾기</button>
                    </li>
                </ul>
            </div>
            <div class="Button">
                <ul>
                    <li><button class="naver_button" @click="naverSocialLogin">네이버 로그인</button></li>
                    <li><button class="kakao_button" @click="naverSocialLogin">네이버 로그인</button></li>
                    <li><button class="unsign_button" @click="unsignLogin">가입없이 이용</button></li>
                </ul>
            </div>
        </div>

    </template>
    
    <script setup>
    import { ref, reactive, computed } from 'vue';
    import { useRouter} from 'vue-router';
    import {useUserStore} from '@/stores/user';
    
    //////변수 선언
    const router = useRouter();
    const userStore = useUserStore();

    const loginUser = reactive({
        id: '',
        password: '',
    });

    const noLogin = reactive({
        id: 'test',
        password: '0000',
    });
    
    // id, password 입력 확인 => id, password 입력시 버튼 활성화
    const disableSubmit = computed(() => !(loginUser.id && loginUser.password));

    //로그인
    const login = async() =>{
        console.log(loginUser);
        try{
            await userStore.login(loginUser);
            router.push('/home')
            //아이디 비번 틀릴시 alter 나오게 만들어야함.
        }catch(error){
            console.log('에러 =>',error);
        }
    };

    //가입없이 이용
    const unsignLogin = async() =>{
        console.log(loginUser);
        try{
            await userStore.login(noLogin);
            //아이디 비번 틀릴시 alter 나오게 만들어야함.
        }catch(error){
            console.log('에러 =>',error);
        }
    };

    /////라우터 이동
    //회원가입 이동
    const GoSignup = () => {
            router.push('./user/signup')
        };
    //아이디 찾기 이동
    const GoFindId = () => {
            router.push('./user/findid')
        };
    //비밀번호 찾기 이동
    const GoFindPwd = ()=>{
            router.push('./user/findpwd')
        };

    </script>
    
    <style scoped>
        .Page {
            width: 100%;
            min-width: 340px;  /*스마트폰 기준 너비 */
            margin: 0 auto;
            padding: 20px;
        }

        ul{
            list-style-type: none;

        }
    </style>
