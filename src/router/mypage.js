export default[
    {
        path: '/mypage',
        name: 'mypage',
        component:()=>import('../pages/mypage/Mypage.vue')
    },
    {
        path: '/profile/:userId', // 다른 사용자의 프로필
        name: 'profile',
        component: () => import('../pages/mypage/Mypage.vue') // 같은 Mypage.vue 컴포넌트 사용
    },    
    {
        path:'/mypage/edit',
        name:'mypageEdit',
        component:()=>import('../pages/mypage/MypageEdit.vue')
    },
    { 
        path:'/mypage/socialedit',
        name:'mypageSocialEdit',
        component:()=>import('../pages/mypage/MypageSocialEdit.vue')
    }

];