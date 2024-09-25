export default[
    {
        path: '/mypage/:userNo', //userNo를 파라미터로 받아야 함
        name: 'mypage',
        component:()=>import('../pages/mypage/Mypage.vue')
    },
    {
        path:'/mypage/:userNo/edit',
        name:'mypageEdit',
        component:()=>import('../pages/mypage/MypageEdit.vue')
    },
    {
        path:'/mypage/:userNo/socialedit',
        name:'mypageSocialEdit',
        component:()=>import('../pages/mypage/MypageSocialEdit.vue')
    },
    {
        path:'/mypage/:userNo/logo',
        name:'mypageLogo',
        component:()=>import('../pages/mypage/Logo.vue')
    }
];