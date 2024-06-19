import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import qs from 'qs'
import moment from 'moment'
import './assets/iconfont/iconfont.css'
// import './components' //自定义组件全局注册
import './styles/base.less'
import Auth from "./directives/auth"
import VueContextMenu from "vue-contextmenu"
Vue.use(VueContextMenu)
Vue.use(ElementUI,{size: 'small' });
// Vue.use(ElementUI);
Vue.prototype.$EventBus = new Vue();
Vue.prototype.$axios = axios //全局注册，使用方法为:this.$axios
Vue.prototype.qs = qs //全局注册，使用方法为:this.qs
Vue.config.productionTip = false
Vue.prototype.$moment = moment;
Vue.use(Auth) //按钮权限检验指令
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')