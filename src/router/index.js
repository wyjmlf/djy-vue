import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ueditor from '@/pages/ueditor_demo.vue'
import role from '../components/page/promiss/role/role'
import user from '../components/page/promiss/user/user'
import login_log from '../components/page/log/login_log'
import operate from '../components/page/log/operate'
import addRole from '../components/page/promiss/role/addRole'
import updateRole from '../components/page/promiss/role/updateRole'
import addUser from '../components/page/promiss/user/addUser'
import updateUser from '../components/page/promiss/user/updateUser'

Vue.use(Router)

export default new Router({
  routes: [
   
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
        path: '*',
        redirect: '/404'
    },
    {
        path: '/',
        component: resolve => require(['../components/common/Home.vue'], resolve),
        meta: { title: '自述文件' },
        children:[
            {
                path: '/dashboard',
                component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                meta: { title: '系统首页' }
            },
           
            
            {
                path:'/role',
                component: role,
                meta:{title:'角色管理',auth:'role_menu'}
            },
            {
                path: '/addRole',
                component: addRole,
                meta:{title:'新增角色',auth:'role_save_btn'}
            },
            {
                path: '/updateRole',
                component: updateRole,
                meta:{title:'修改角色',auth:'role_update_btn'}
            },
             
            {
                path:'/user',
                component:user,
                meta:{title:"用户管理",auth:'user_menu'}
            },
            {
                path: '/addUser',
                component: addUser,
                meta:{title:'新增用户',auth:'user_button_save'}
            },
            {
                path: '/updateUser',
                component: updateUser,
                meta:{title:'用户编辑',auth:'user_button_update'}
            },
            {
                path:'/login_log',
                component: login_log,
                meta:{title:'登陆日志',auth:'log_login_menu'}
            },
            {
                path:'/operate',
                component: operate,
                meta:{title:'操作日志',auth:'log_operate_menu'}
            },

            {
                path: '/404',
                component: resolve => require(['../components/page/404.vue'], resolve),
                meta: { title: '404' }
            },
            {
                path: '/403',
                component: resolve => require(['../components/page/403.vue'], resolve),
                meta: { title: '403' }
            }
        ]
    }
    
]
})
