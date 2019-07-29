<template>
  <div>
    <br />
    <br />
    <div style="    background-color: whitesmoke ">
      <div style="width:60%">
        <el-row :gutter="10">
          <el-form ref="page" :model="page" label-width="80px" size="mini">
            <el-col :span="6">
              <el-form-item label="用户名：">
                <el-input v-model="page.username" placeholder="用户名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态：">
                <el-select v-model="page.status" placeholder="选择状态">
                  <el-option label="全部" :value="null"></el-option>
                  <el-option label="成功" :value="true"></el-option>
                  <el-option label="失败" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item>
                <el-button
                 
                  type="warning"
                  @click="getPageListByParam()"
                  size="mini"
                >查询</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </div>
    <br />
    <br />

    <el-table :data="sysLogList" border style="width: 100%" v-loading="loading">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="username" label="用户名" align="center"></el-table-column>
      <el-table-column prop="urlDesc" label="操作" align="center"></el-table-column>
      <el-table-column prop="url" label="请求URL" align="center"></el-table-column>
      <el-table-column prop="method" label="请求方式" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status">成功</span>
          <span v-else style="color:red;">失败</span>
        </template>
      </el-table-column>
      
      <el-table-column prop="ip" label="操作IP" align="center"></el-table-column>
      <el-table-column prop="creatTime" label="时间" align="center"></el-table-column>
    </el-table>
    <br><br>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10,
        type: 2,
        status: null,
        username: null
      },
      loading: false,
      sysLogList: [],
      totalSize: 0
    };
  },
  created() {
    localStorage.setItem('logFlg',true);
    this.sysLogPageList();
  },
  methods: {
    getPageListByParam() {
      localStorage.setItem('logFlg',false);
      this.page.pageSize = 10;
      this.page.pageNum = 1;
      this.sysLogPageList();
    },
    handleSizeChange(val) {
      localStorage.setItem('logFlg',false);
      this.page.pageSize = val;
      this.sysLogPageList();
    },
    handleCurrentChange(val) {
      localStorage.setItem('logFlg',false);
      this.page.pageNum = val;
      this.sysLogPageList();
    },
    sysLogPageList() {
      this.loading = true;
      let url = "/log/operate";
      this.$axios.post(url, this.page).then(result => {
        console.log(result);
        if (result.data.code == 200) {
          this.sysLogList = result.data.data;
          this.totalSize = result.data.total;
          this.loading = false;
        }
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
.error {
  color: red;
}
</style>