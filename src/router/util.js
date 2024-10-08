export default[
    {
        path:'/util/error',
        name:'error',
        component:()=>import('../pages/Error.vue')
    },
    {
        path:'/util/loading',
        name:'loading',
        component:()=>import('../pages/Loading.vue')
    }
]