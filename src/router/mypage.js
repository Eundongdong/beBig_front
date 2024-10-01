export default[
    {
        path: '/mypage',
        name: 'mypage',
        component:()=>import('../pages/mypage/Mypage.vue')
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
    },
    {
        path:'/mypage/logo',
        name:'mypageLogo',
        component:()=>import('../pages/mypage/Logo.vue')
    }
];