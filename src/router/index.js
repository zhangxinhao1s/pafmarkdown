import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/layout';
import storage from "@/utils/storage/storage";
import store from '../store'


// const TemplateShow  = () => import(/* webpackChunkName: "TemplateShow" */ '@/views/TemplateShow.vue')

// // 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

export const initRoutes = [{
  path: '/',
  name: '/',
  hidden: true,
  redirect: '/home',
  component: () => import('@/layout'),
  children: [{
    path: '/home',
    name: 'home',
    hidden: true,

    component: () => import('@/views/home'),
    meta: {
      title: '卷宗管理',
      icon: '',
    },
  },

  ]
},
{
  name: '404',
  path: '/404',
  hidden: true,
  component: () => import('@/views/common/404'),
},
];


const router = new Router({
  // mode: 'history',
  base: process.env.NODE_ENV === 'development' ? '/' : '/',
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: initRoutes,
})
// router.matcher = new Router({mode:'hash'}).matcher

export default router

router.beforeEach((to, from, next) => {
  if (!store.state.app.isAddRouter) {
    const userInfo = storage.getItem("userInfo");
    if (userInfo) {
      store.commit('user/SET_USER_INFO', userInfo)
      store.commit("app/CHANGE_IS_LOGIN", true)
      store.commit("app/CHANGE_IS_ADD_ROUTER", true)
      // if(userInfo.userType == "QYYH" ){
      //       console.log("qyyh===",qyyh)
      //      router.addRoute(qyyh)
      // }else{
      //   console.log("dsfjkr===",dsfjkr)
      //      router.addRoute(dsfjkr)
      // }
      next(to.redirectedFrom ? {
        path: to.redirectedFrom,
        replace: true
      } : {
        ...to,
        replace: true
      })
      return
    }
  }
  next() // 确保一定要调用 next()
})