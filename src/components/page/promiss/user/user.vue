<template>
  <div>
    <br />
    <br />
    <div style="    background-color: whitesmoke ">
      <div style="width:60%">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form ref="page" :model="page" label-width="80px" size="mini">
              <el-form-item label="名称：">
                <el-input v-model="page.username" placeholder="用户名"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="2">
            <el-button class="roleBtn" @click="getPageListByParam()" size="mini">查询</el-button>
          </el-col>
          <el-col :span="2" v-allow="'user_button_save'">
            <router-link :to="'/addUser'">
              <el-button type="warning" class="roleBtn" size="mini">新增</el-button>
            </router-link>
          </el-col>
          <el-col :span="2"  v-allow="'user_button_delete'">
            <el-button type="danger" class="roleBtn" @click="deleteUser()" size="mini">删除</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <br />
    <br />
    <el-table
      :data="pageList"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
           <img :src="scope.row.img" style="width:150px; height:150px;">
          <div slot="reference" class="name-wrapper">
            <img :src="scope.row.img" style="width:30px; height:30px;     border-radius: 50%;">
          </div>
        </el-popover>
      </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
      <el-table-column prop="tel" label="手机号" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1">正常</span>
          <span v-else style="color:red;">停用</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.creatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近登陆时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.lastLogin }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <router-link :to="{path:'/updateUser',query:{userId:scope.row.id}}">
          <el-button type="text" size="small" v-allow="'user_button_update'" style="color:#C9A965;">编辑</el-button>
          </router-link>
          <el-button type="text" size="small" v-allow="'user_button_delete'" style="color:red;" @click="deleteBtn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br />
    <br />
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage"
    ></el-pagination>
  </div>
</template>

<script>
import { error } from "../../../../js/message";
export default {
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10,
        username: ""
      },
      loading: false,
      pageList: [],
      totalPage: 0,
      idList: []
    };
  },
  created() {
    localStorage.setItem('logFlg',true);
    this.userPageList();
  },
  methods: {
    /**分页 */
    handleSizeChange(val) {
      localStorage.setItem('logFlg',false);
      this.page.pageSize = val;
      this.userPageList();
    },
    handleCurrentChange(val) {
      localStorage.setItem('logFlg',false);
      this.page.pageNum = val;
      this.userPageList();
    },
    getPageListByParam() {
      localStorage.setItem('logFlg',false);
      this.page.pageSize = 10;
      this.page.pageNum = 1;
      this.userPageList();
    },
    userPageList() {
      this.loading = true;
      let url = "/user/pageList";
      this.$axios.post(url, this.page).then(result => {
        console.log(result);
        if (result.data.code == 200) {
          this.pageList = result.data.data;
          this.totalPage = result.data.total;
          this.loading = false;
        }
      });
    },
    /**表格复选框 */
    handleSelectionChange(val) {
      this.idList = [];
      if (val.length > 0) {
        val.forEach((currentValue, index, arr) => {
          this.idList.push(currentValue.id);
        });
      }
    },
    /**删除 */
    deleteBtn(row) {
      this.idList = [];
      this.idList.push(row.id);
      this.deleteUser();
    },
    deleteUser() {
      if (this.idList.length == 0) {
        error("请选择要删除得数据");
        return;
      }
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let url = "/user/delete";
        this.$axios.post(url, { list: this.idList }).then(result => {
          this.userPageList();
          this.idList = [];
        });
      });
    }
  }
};
</script>

<style>
.el-col {
  height: 100px;
  line-height: 100px;
  display: flex;
  align-items: center;
}
.el-form {
  margin-top: 17px;
}

.el-button--warning {
  background-color: #c9a965;
  border-color: #c9a965;
}
</style>