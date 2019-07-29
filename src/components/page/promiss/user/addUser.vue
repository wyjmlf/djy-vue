<template>
  <div>
    <br />
    <br />

    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      style="width:50%;"
      size="mini"
      :status-icon="true"
    >
      <el-form-item label="头像：" prop="img" style=" width: 180px;">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="ruleForm.img" :src="ruleForm.img" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input type="password" v-model="ruleForm.password"></el-input>
      </el-form-item>

      <el-form-item label="确认密码：" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass"></el-input>
      </el-form-item>

      <el-form-item label="真实姓名：" prop="realName">
        <el-input type="realName" v-model="ruleForm.realName"></el-input>
      </el-form-item>

      <el-form-item label="手机号：" prop="tel">
        <el-input type="tel" v-model="ruleForm.tel"></el-input>
      </el-form-item>

      <el-form-item label="邮箱：" prop="email">
        <el-input type="email" v-model="ruleForm.email"></el-input>
      </el-form-item>

      <el-form-item label="角色设置" prop="list">
        <el-select v-model="ruleForm.list" multiple placeholder="请选择角色" style="width:100%">
          <el-option
            v-for="item , index in sysRoleList "
            :label="item.label"
            :value="item.id"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态：" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="2">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
        <router-link :to="'/user'">
          <el-button >返回</el-button>
        </router-link>
        
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import OSS from "ali-oss";
import { error } from "../../../../js/message";
export default {
  data() {
    var validatorPassword = (rule, value, callback) => {
      console.log(value);
      if (!value || value === "") {
        callback(new Error("请输入密码"));
      }
      if (value.trim().length < 6) {
        callback(new Error("密码不能小于6位"));
      }
      callback();
    };

    var validatorcheckPass = (rule, value, callback) => {
      console.log(value);
      if (!value || value === "") {
        callback(new Error("请输入确认密码"));
      }
      if (value.trim() == "") {
        callback(new Error("请输入确认密码"));
      }
      if (value != this.ruleForm.password) {
        callback(new Error("密码不一致"));
      }
      callback();
    };

    var validatorTel = (rule, value, callback) => {
      if (!this.regTel.test(value)) {
        return callback(new Error("手机号格式错误"));
      }
      callback();
    };
    var validatorEmail = (rule, value, callback) => {
      if (!this.regemail.test(value)) {
        return callback(new Error("邮箱格式错误"));
      }
      callback();
    };
    return {
      regTel: /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/,
      regemail: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
      sysRoleList: [],
      ossSign: {},
      ruleForm: {
        username: "",
        password: "",
        checkPass: "",
        status: "",
        email: "",
        tel: "",
        list: [],
        realName: "",
        img: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        img: [{ required: true, message: "请上传头像", trigger: "blur" }],
        password: [{ validator: validatorPassword, trigger: "blur" }],
        checkPass: [{ validator: validatorcheckPass, trigger: "blur" }],
        realName: [
          { required: true, message: "真实姓名不能为空", trigger: "blur" }
        ],
        tel: [{ validator: validatorTel, trigger: "blur" }],
        email: [{ validator: validatorEmail, trigger: "blur" }]
      }
    };
  },
  created() {
    localStorage.setItem('logFlg',true);
    this.getSysRole();
    this.getOssSign();
  },
  methods: {
    getOssSign() {
      let url = "/oss/getSign";
      this.$axios.post(url, null).then(result => {
        this.ossSign = result.data.data;
        console.log(this.ossSign);
      });
    },
    getSysRole() {
      let url = "/role/findAll";
      this.$axios.post(url, null).then(reuslt => {
        this.sysRoleList = reuslt.data.data;
      });
    },

    beforeAvatarUpload(file) {
      var regx = new RegExp("(.png)$|(.jpg)");
      let nameStr = file.name.substring(file.name.indexOf("."));

      if (!regx.test(nameStr)) {
        this.$message.error("只支持png、jpg格式的文件");
        return false;
      }
      var suffx = file.name.substring(file.name.indexOf("."));
      var timestamp = this.ossSign.dir + new Date().getTime() + suffx;
      var client = new OSS({
        key: timestamp,
        policy: this.ossSign.policy,
        accessKeyId: this.ossSign.accessid,
        accessKeySecret: this.ossSign.accesssecret,
        bucket: this.ossSign.bucket,
        signature: this.ossSign.signature,
        region: "oss-cn-shanghai"
      });
      client
        .multipartUpload(timestamp, file)
        .then(result => {
          let oss_img_url = result.res.requestUrls[0];
          if (oss_img_url.indexOf("?") == -1) {
            this.ruleForm.img = oss_img_url;
          } else {
            this.ruleForm.img = result.res.requestUrls[0].substring(
              0,
              result.res.requestUrls[0].indexOf("?")
            );
          }
        })
        .catch(function(err) {
          error("文件上传失败");
        });
      return false;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url = "/user/sava";
          this.$axios.post(url, this.ruleForm).then(reuslt => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 180px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
