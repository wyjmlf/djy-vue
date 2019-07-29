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
                <el-input v-model="page.label" placeholder="名称"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="2">
            <el-button class="roleBtn" @click="getPageListByParam()" size="mini">查询</el-button>
          </el-col>
          <el-col :span="2"  v-allow="'role_save_btn'">
            <router-link :to="'/addRole'">
            <el-button type="warning" class="roleBtn" size="mini">新增</el-button>
            </router-link>
          </el-col>
          <el-col :span="2" v-allow="'role_delete_btn'">
            <el-button type="danger"  class="roleBtn" @click="deleteRole()" size="mini">删除</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <br />
    <br />
    <el-table :data="roleList" border style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="label" label="名称" align="center"></el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{scope.row.remarks}}</p>

            <div slot="reference" class="name-wrapper">
              <span>{{scope.row.remarks|strLength(10)}}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status">正常</span>
          <span v-else style="color:red">停用</span>
        </template>
      </el-table-column>

      <el-table-column prop="creatTime" label="操作时间" align="center"></el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            @click="editSysRole(scope.row)"
            type="text"
            size="small"
            style="color:#C9A965;"
            v-allow="'role_update_btn'"
          >编辑</el-button>
          <el-button type="text" v-allow="'role_delete_btn'" size="small" style="color:red;" @click="deleteBtn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
<br><br>
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
        label: null,
        pageNum: 1,
        pageSize: 10
      },
      roleList: [],
      totalPage: 0,
      idList: []
    };
  },
  created() {
    localStorage.setItem('logFlg',true);
    this.pageList();
  },
  methods: {
    handleSizeChange(val) {
      localStorage.setItem('logFlg',false);
      this.page.pageSize = val;
      this.pageList();
    },
    handleCurrentChange(val) {
      localStorage.setItem('logFlg',false);
      this.page.pageNum = val;
      this.pageList();
    },
    getPageListByParam() {
      localStorage.setItem('logFlg',false);
      this.page.pageSize = 10;
      this.page.pageNum = 1;
      this.pageList();
    },
    pageList() {
      this.loading=true;
      let url = "/role/page";
      this.$axios.post(url, this.page).then(result => {
        console.log(result);
        if (result.data.code == 200) {
          this.roleList = result.data.data;
          this.totalPage = result.data.total;
          this.loading=false;
        }
      });
    },
    /**表格复选框操作 */
    handleSelectionChange(val) {
      this.idList = [];
      if (val.length > 0) {
        val.forEach((currentValue, index, arr) => {
          this.idList.push(currentValue.id);
        });
      }
    },
    /**删除 */
    deleteBtn(row){
        this.idList = [];
        this.idList.push(row.id);
        this.deleteRole()
    },
    deleteRole() {
      if (this.idList.length == 0) {
        error("请选择要删除得数据");
        return;
      }
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let url = "/role/delete";
        this.$axios.post(url, { list: this.idList }).then(result => {
            this.pageList();
            this.idList = [];
        });
      });
    },
    editSysRole(row){
       this.$router.push({ path: '/updateRole', query: { roleId: row.id }});
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
