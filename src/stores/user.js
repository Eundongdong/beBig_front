import {ref, computed} from 'vue';
import {defineStore} from 'pinia';
import userApi from "@/api/UserApi";

const initState={
    token:'',
    user:{
        userId:''
    }
};

export const useUserStore=defineStore('user', () => {
    const state=ref({...initState});

    const isLogin=computed(()=>state.value.user.userId);

    const id=computed(()=>state.value.user.userId);


    const login=async(loginUser)=>{
        const{data}=await userApi.login(loginUser);
        state.value={...data};
        localStorage.setItem('user', JSON.stringify(state.value));
    };

    const logout=()=>{
        localStorage.clear();
        state.value={...initState};
    };

    const getToken=()=>state.value.token;

    const load=()=>{
        const user=localStorage.getItem('user');
        if(user != null){
            state.value=JSON.parse(user);
            console.log(state.value);
        }
    };

    load();

    return{state, id, isLogin, login, logout, getToken};
});