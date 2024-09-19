import { createRouter, createWebHistory } from "vue-router";

import AddBank from '@/pages/AddBank.vue'
import Asset from '@/pages/Asset.vue'
import CommunityAdd from '@/pages/CommunityAdd.vue'
import CommunityDetail from '@/pages/CommunityDetail.vue'  
import CommunityList from '@/pages/CommunityList.vue'  
import FindID from '@/pages/FindID.vue'  
import FindPwd from '@/pages/FindPwd.vue'  
import Login from '@/pages/Login.vue'  
import Logo from '@/pages/Logo.vue'  
import Main from '@/pages/Main.vue'  
import Mission from '@/pages/Mission.vue'  
import Mypage from '@/pages/Mypage.vue'  
import MypageEdit from '@/pages/MypageEdit.vue'  
import MypageSocialEdit from '@/pages/MypageSocialEdit.vue'  
import Policy from '@/pages/Policy.vue'  
import Signup from '@/pages/Signup.vue'  
import SocialSignup from '@/pages/SocialSignup.vue'  
import Survey from '@/pages/Survey.vue'  
import SurveyResult from '@/pages/SurveyResult.vue'
import BankLogin from '@/pages/BankLogin.vue'
import AccountList from '@/pages/AccountList.vue'
import AccountDetail from '@/pages/AccountDetail.vue'
import SurveyStart from '@/pages/SurveyStart.vue'  



const router = createRouter({
    history: createWebHistory(),
    routes : [
        {path:'/addbank', component:AddBank},
        {path:'/banklogin', component:BankLogin},
        {path:'/accountlist', component:AccountList},
        {path:'/accountdetail', component:AccountDetail},
        {path:'/asset', component:Asset},
        {path:'/communityadd', component:CommunityAdd},
        {path:'/communitydetail', component:CommunityDetail},
        {path:'/community', component:CommunityList},
        {path:'/findid', component:FindID},
        {path:'/findpwd', component:FindPwd},
        {path:'/login', component:Login},
        {path:'/logo', component:Logo},
        {path:'/', component:Main},
        {path:'/mission', component:Mission},
        {path:'/mypage', component:Mypage},
        {path:'/mypageedit', component:MypageEdit},
        {path:'/mypagesocialedit', component:MypageSocialEdit},
        {path:'/policy', component:Policy},
        {path:'/signup', component:Signup},
        {path:'/socialsignup', component:SocialSignup},
        {path:'/surveystart', component:SurveyStart},
        {path:'/survey', component:Survey},
        {path:'/surveyresult', component:SurveyResult},

    ]   
})
export default router;