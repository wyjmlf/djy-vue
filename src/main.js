// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import '../static/icon/iconfont.js'
import '../static/icon/iconfont.css'
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
import OSS from 'ali-oss'  
import $ from 'jquery'
import { success, error } from './js/message'
Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;
// axios.defaults.baseURL = 'http://121.42.242.95:2101/security-path-djy';
axios.defaults.baseURL = 'http://94.191.54.168:2101/security-path-djy';
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    var token = localStorage.getItem("djy_token");
    var logFlg = localStorage.getItem("logFlg");
    console.log(logFlg)
    config.headers.Authorization = token;
    config.headers.logFlg = logFlg;
  
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
  
  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    
    if (response.data.code == 200) {
      if (response.data.show) {
        success(response.data.msg)
      }
  
    } else {
      if (response.data.show) {
        error(response.data.msg)
        if (response.data.code == 300) {
  
          router.push({ path: '/login' })
        }
      }
    }
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });




//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  
  if(to.path=='/login'){
    next();
    return;
  }
  // if(to.path=='/security-path-djy/dashboard'){
  //   next();
  //   return;
  // }
  
  if(!localStorage.getItem('djy_user_menu')){
    
    next('/login')
  }else{
    let djy_user_menu = JSON.parse(localStorage.getItem('djy_user_menu'));
    let flg=djy_user_menu.some((currentValue, index, arr) => {
      let promis = currentValue.promis;
      if(to.meta.auth==promis){
        if(to.meta.auth==promis){
           return true;
        }
      }
    })
     
    if(!flg){
      error('无权访问')
      next('/403')
      // next('/security-path-djy/403')
    }
    if(to.path=='/403'){
      next();
      return;
    }
  }
  next()
   

})




Vue.directive('allow', {
  inserted: (el, binding, vnode) => {
    //var Primess=store.getters.getPrimess
    let djy_user_menu = JSON.parse(localStorage.getItem('djy_user_menu'));
    let flg = false;
    djy_user_menu.forEach((currentValue, index, arr) => {
      let promis = currentValue.promis;
      if (binding.value == promis) {
        flg = true;
         
      }
    })
    if (!flg) {
      el.parentNode.removeChild(el)
    }
    //  if(!Primess.includes(binding.value)  ){
    //   el.parentNode.removeChild(el)
    //  }
  }
})




Vue.filter('strLength', function (message, leg) {

  if (message.length > leg) {
    message = message.substring(0, leg) + '...'

  }

  return message;
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
