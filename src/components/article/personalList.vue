<template>
  <el-row class="wrap">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>个人文章列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="题目/标签/创作时间/作者" style="min-width: 240px;"></el-input>
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
        <el-table-column prop="resume" label="简述" show-overflow-tooltip="true" min-width="120" sortable>
        </el-table-column>
        <el-table-column prop="createTime" label="创作时间" width="100"  sortable>
        </el-table-column>
        <el-table-column prop="createUser" label="作者" width="160" sortable>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @search="search" @click="toEditor(scope.$index,scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="removeArticle(scope.$index,scope.row)">删除</el-button>
          </template>
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
  import ARTICLE_API from "../../api/api_article";
  import 'tinymce/plugins/code';
  import {bus} from '../../bus.js'

  export default {
    data() {
      return {
        filters: {
          name: ""
        },
        articleRows: [],
        articleId: '',
        resume: '',
        content: '',
        roles: [],
        roleIds: [],
        viewOrOperation: '',
        total: 0,
        page: 1,
        limit: 10,
        loading: false,
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
        if(that.viewOrOperation !== 2){
          ARTICLE_API.clickPlus({articleId: currentRow.articleId}).then(res => {
            if(res.code === 0){
              let params = {
                content: currentRow.content,
                articleId: currentRow.articleId,
                author: currentRow.createUser,
                click: currentRow.click,
                createTime: currentRow.createTime,
                isJump: '1',
                path: '/article/personList',
                pathName: '个人文章列表'
              }
              localStorage.setItem("detailsForView", JSON.stringify(params));
              that.$router.push({name: '阅读文章'});
            }else{
              that.$message.error({
                showClose: true,
                message: "操作失败",
                duration: 2000
              })
            }
          })
        }
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
        params.isSecret="3";
        params.personal="1";
        ARTICLE_API.findList(params)
          .then(
            function (result) {
              that.loading = false;
              if (result && result.page.rows) {
                that.total = result.page.total;
                for(let p in result.page.rows){//遍历json数组时，这么写p为索引，0,1
                  if(result.page.rows[p].content !== null){
                    let strToHtml=that.decode(result.page.rows[p].content);
                    let strToString = that.strip(strToHtml);
                    result.page.rows[p].content = strToHtml;
                    result.page.rows[p].resume = strToString;
                  }

                }
                that.articleRows = result.page.rows;
                /*
                for(let p in that.articleRows){//遍历json数组时，这么写p为索引，0,1

                  that.articleRows[p].resume = that.strip(result.page.rows[p].content).substr(0,15)+'......';

                }*/
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
      toEditor: function (index, row) {
        let that = this;
        that.viewOrOperation=2;
        let params = {
          articleId: row.articleId,
          title: row.title,
          content: row.content,
          tag: row.tag,
          isSecret: row.isSecret,
          saveOrUpdate: "2",
          isJump: '1',
          path: '/article/personList',
          pathName: '个人文章列表'
        };
        localStorage.setItem("detailsForEdit", JSON.stringify(params));
        that.$router.push({path: '/article/editor'});
      },
      removeArticle: function (index, row) {
        let that = this;
        that.viewOrOperation=2;
        this.$confirm("确认删除该记录吗?", "提示", {type: "warning"})
          .then(() => {
            that.loading = true;
            ARTICLE_API.remove({articleId: row.articleId})
              .then(
                function (result) {
                  that.loading = false;
                  if (result && parseInt(result.code) === 0) {
                    that.$message.success({
                      showClose: true,
                      message: "删除成功",
                      duration: 1500
                    });
                    that.viewOrOperation=1;
                    that.search();
                  }
                }
              ),
              function (err) {
                that.loading = false;
                that.$message.error({
                  showClose: true,
                  message: err.toString(),
                  duration: 2000
                });
              }
                .catch(function (error) {
                  that.loading = false;
                  console.log(error);
                  that.$message.error({
                    showClose: true,
                    message: "请求出现异常",
                    duration: 2000
                  });
                });
          })
          .catch(() => {
          });
      }
    },
    mounted() {
      this.handleSearch();
    }
  };
</script>

<style scoped>
</style>
