<template>
  <div>
    <el-form
      style="width: 30%;"
      size="mini"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="名称：" prop="label">
        <el-input v-model="ruleForm.label"></el-input>
      </el-form-item>

      <el-form-item label="备注：" prop="remarks">
        <el-input v-model="ruleForm.remarks"></el-input>
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="ruleForm.status">
          <el-option label="正常" :value="1"></el-option>
          <el-option label="停用" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="权限：">
        <!-- <div id="test12" class="demo-tree-more"></div> -->
         <ul id="treeDemo" class="ztree"></ul>
      </el-form-item>
        <br><br>
      <el-form-item>
        <el-button type="warning" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button type="warning" plain @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import "../../../../../static/layui/css/layui.css";
// import "../../../../../static/layui/layui.all.js";
import "../../../../../static/ztree/css/metroStyle/metroStyle.css";
import "../../../../../static/ztree/js/jquery-1.4.4.min.js";
import "../../../../../static/ztree/js/jquery.ztree.core";
import "../../../../../static/ztree/js/jquery.ztree.excheck";
export default {
  data() {
    return {
      layTree: [],
      treeObject:{},
      ruleForm: {
        id:null,
        label: "", //角色名称
        remarks: "", //备注，
        status: 1, //状态
        list: [] //菜单集合
      },
      rules: {
        label: [{ required: true, message: "名称不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    localStorage.setItem('logFlg',true);
    this.getMenuTree();
  },
  methods: {
    /**获取菜单树 */
    getMenuTree() {
      let url = "/sysMenu/getMenuTree";
      this.$axios.post(url, null).then(result => {
        if (result.data.code == 200) {
          this.layTree = result.data.data;
          this.treeNode();
        }
      });
    },
    /**加载树菜单 */
    // lodingTree() {
    //   layui.use(["tree", "util"], () => {
    //     var tree = layui.tree,
        
    //       layer = layui.layer,
    //       util = layui.util,
    //       data = this.layTree;
    //       this.treeObject=tree;
    //     tree.render({
    //       elem: "#test12",
    //       data: data,
    //       showCheckbox: true, //是否显示复选框
    //       id: "demoId1",

    //       edit: ["add", "update", "del"], //操作节点的图标
    //       click: function(obj) {
    //         var data = obj.data; //获取当前点击的节点数据
    //         layer.msg(
    //           "状态：" + obj.state + "<br>节点数据：" + JSON.stringify(data)
    //         );
    //       }
    //     });
        
    //   });
    // },
    treeNode() {
      var $j = jQuery.noConflict(); 
      var zTreeObj;
      // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
      var setting = {
        simpleData: {
          enable: true,
          idKey: "id",
          pIdKey: "pid",
          rootPId: 0 //根节点
        },
        check: {
          enable: true
        },
        data: {
          key: {
            children: "children",
            name: "title"
          }
        }
      };
      // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
      var zNodes = this.layTree;
      $(document).ready(function() {
        zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        
      });
      this.treeObject=$.fn.zTree.getZTreeObj("treeDemo");
      this.treeObject.expandAll(true);
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              //获得选中的节点
            var checkData = this.treeObject.getCheckedNodes(true);
            this.ruleForm.list=checkData;
            let url='/role/save';
            this.$axios.post(url,this.ruleForm).then(result=>{
                console.log(result)
            })
             console.log(checkData)
          } else {
            console.log('error submit!!');
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
.savaRoleInput {
  width: 30%;
}
.el-button--warning.is-plain{
    color: #c9a965;
  }
</style>
