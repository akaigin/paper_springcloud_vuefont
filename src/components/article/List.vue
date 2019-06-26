<template>
  <el-row class="wrap">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>文章列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="用户名/姓名/昵称" style="min-width: 240px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="articleRows" highlight-current-row @current-change="selectCurrentRow" v-loading="loading" style="width: 100%;">
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="title" label="题目" width="400" sortable>
        </el-table-column>
        <el-table-column prop="resume" label="简述" min-width="120" sortable>
        </el-table-column>
        <el-table-column prop="createTime" label="创作时间" width="100"  sortable>
        </el-table-column>
        <el-table-column prop="createUser" label="作者" width="160" sortable>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

    </el-col>
  </el-row>
</template>

<script>
  import API from "../../api/api_user";
  import ROLE_API from "../../api/api_role";
  import ARTICLE_API from "../../api/api_article";
  import 'tinymce/plugins/code';

  export default {
    data() {
      return {
        filters: {
          name: ""
        },
        loading: false,
        articleRows: [],
        articleId: '',
        resume: '',
        content: '',
        roles: [],
        roleIds: [],
        total: 0,
        page: 1,
        limit: 10,
        editFormVisible: false,
        editFormRules: {
          username: [
            {required: true, message: "请输入用户名", trigger: "blur"}
          ],
          password: [{required: true, message: "请输入作者", trigger: "blur"}],
          name: [{required: true, message: "请输入姓名", trigger: "blur"}]
        },
        editForm: {
          username: "",
          password: "",
          name: "",
          email: "",
          phone: "",
          roleIds: []
        },
        //新增相关数据
        addFormVisible: false, //新增界面是否显示
        addLoading: false,
        addFormRules: {
          username: [
            {required: true, message: "请输入用户名", trigger: "blur"}
          ],
          password: [{required: true, message: "请输入作者", trigger: "blur"}],
          name: [{required: true, message: "请输入姓名", trigger: "blur"}]
        },
        addForm: {
          username: "",
          password: "",
          name: "",
          email: "",
          phone: "",
          roleIds: []
        }
      };
    },
    methods: {
      decode(str) {
        return decodeURIComponent(atob(str).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
      },
      strip: function (html) {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || "";
      },
      selectCurrentRow(currentRow, oldCurrentRow) {
        let that = this;
        ARTICLE_API.clickPlus({articleId: currentRow.articleId}).then(res => {
          if(res.code === 0){
            let params = {
              content: currentRow.content,
              isJump: '1',
              path: '/article/list',
              pathName: '文章列表'
            }
            that.$router.push({path: '/article/view' , query: params});
          }else{
            that.$message.error({
              showClose: true,
              message: "操作失败",
              duration: 2000
            })
          }
        })
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      handleSearch() {
        this.total = 0;
        this.page = 1;
        this.search();
      },
      //获取用户列表
      search: function () {
        let that = this;
        let params = {
          page: that.page,
          limit: 10,
          name: that.filters.name
        };

        that.loading = true;
        params.isSecret="2";
        params.personal="2";
        ARTICLE_API.findList(params)
          .then(
            function (result) {
              that.loading = false;
              if (result && result.page.rows) {
                that.total = result.page.total;
                for(let p in result.page.rows){//遍历json数组时，这么写p为索引，0,1
                  let str=that.decode(result.page.rows[p].content);
                  result.page.rows[p].content = that.strip(str);

                }
                that.articleRows = result.page.rows;
                for(let p in that.articleRows){//遍历json数组时，这么写p为索引，0,1

                  that.articleRows[p].resume = result.page.rows[p].content.substr(0,15)+'......';

                }
              }
            },
            function (err) {
              that.loading = false;
              that.$message.error({
                showClose: true,
                message: err.toString(),
                duration: 2000
              });
            }
          );
      },
    },
    mounted() {
      this.handleSearch();
    }
  };
</script>

<style scoped>

</style>
