<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">江苏大剧院AR后台管理系统</div>
      <el-form :model="ruleForm"  ref="ruleForm" label-width="0px" class="ms-content">
        <el-form-item label prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入登陆名">
            <template slot="prepend">
             <span class="iconfont el-icon-ali-yonghu"></span>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入登陆密码" v-model="ruleForm.password" >
             <template slot="prepend">
             <span class="iconfont el-icon-ali-quanxianguanli"></span>
            </template>
          </el-input>
        </el-form-item>
        
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()" :loading="loading">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {success,error} from '../../js/message'
export default {
  data: function() {
    return {
      loading:false,
      ruleForm: {
        username: "",
        password: ""
      } 
    };
  },
  created(){
    localStorage.setItem('logFlg',true);
  },
  methods: {
    submitForm() {
        if(this.ruleForm.username==''){
            error("请输入用户名")
            return;
        }
        if(this.ruleForm.password==''){
            error("请输入密码")
            return;
        }
        this.loading=true;
        let url='/user/login';
        
        this.$axios.post(url,this.ruleForm).then(result=>{
            this.loading=false;
            if(result.data.code==200){
              let djy_token=result.data.data.Authorization;
              localStorage.setItem("djy_token",djy_token);
               
              localStorage.setItem('djy_user_menu',JSON.stringify(result.data.data.djy_user_menu))
              this.$router.push({ path: '/dashboard' })

            }
        })
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  /* background-image: url(../../assets/img/login-bg.jpg); */
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
  background-color: #c9a965;
  border: 0px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.el-input-group__prepend{
    background-color: white;
}
</style>