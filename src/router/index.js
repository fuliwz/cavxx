import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Play from '../views/Play.vue'
import Category from '../views/Category.vue'
import Search from '../views/Search.vue'
import History from '../views/History.vue'
const routes=[
 {path:'/',name:'home',component:Home},
 {path:'/play/:id',name:'play',component:Play,props:true},
 {path:'/category/:id/:page?',name:'category',component:Category,props:true},
 {path:'/search',name:'search',component:Search},
 {path:'/history',name:'history',component:History}
]
export default createRouter({history:createWebHistory(),routes,scrollBehavior(){return{top:0,left:0}}})
