<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#414259"
            text-color="#bfcbd9" active-text-color="white" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i   :class="item.icon"></i><span slot="title" >{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title" >{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index" >
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title" >{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                list:[],
                items: [
                    {
                        icon: 'iconfont el-icon-ali-caidan',
                        index: '/security-path-djy/dashboard',
                        title: '系统首页',
                        auth:['sys_index']
                     },
                     {
                         icon: 'iconfont el-icon-ali-quanxianguanli',
                         index: '2',
                         title: '权限管理',
                         auth:['role_menu','user_menu'],
                         subs: [
                            {
                                 index: '/security-path-djy/role',
                                 title: '角色管理',
                                 auth:['role_menu'],
                             },
                             {
                                 index: '/security-path-djy/user',
                                 title: '用户管理',
                                 auth:['user_menu'],
                             }
                         ]
                     },
                     {
                         icon: 'iconfont el-icon-ali-gaojian',
                         index:'3',
                         title: '日志管理',
                         auth: ['log_login_menu','log_operate_menu'],
                         subs:[
                             {
                                 index: '/security-path-djy/login_log',
                                 title: '登陆日志',
                                 auth: ['log_login_menu']
                             },
                             {
                                 index: '/security-path-djy/operate',
                                 title: '操作日志',
                                 auth:['log_operate_menu']
                             }
                         ]
                     }
                ],
                menuList:[]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
            this.menuList=[];
            let djy_user_menu=JSON.parse(localStorage.getItem('djy_user_menu'));
              
           this.items=this.filterArray(djy_user_menu,0);
        },
        methods:{
            filterArray(data, parent) {
                let vm = this;
                var tree = [];
                var temp;
                 console.log(data)
                for (var i = 0; i < data.length; i++) {
                    if (data[i].pid == parent) {
                        // var obj = data[i];
                        if(data[i].type==3){
                            continue;
                        }
                        var obj={
                            icon:data[i].icon,
                            index:data[i].vuePath,
                            title:data[i].title,
                            auth:data[i].promis
                        }
                        temp = this.filterArray(data, data[i].id);
                        if (temp.length > 0) {
                            obj.subs = temp;
                        }
                        tree.push(obj);
                    }
                }
                return tree;
            }

        }
    }

    /**
     * 
     * ,
                    {
                        icon: 'el-icon-rank',
                        index: '6',
                        title: '拖拽组件',
                        subs: [
                            {
                                index: 'drag',
                                title: '拖拽列表',
                            },
                            {
                                index: 'dialog',
                                title: '拖拽弹框',
                            }
                        ]
                    } 
     * 
     * 
     */
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
     
  
</style>
