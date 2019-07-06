<template lang="html">

  <el-row class="wrap">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item v-if="this.$route.query.isJump === '1'" :to="{ path: this.$route.query.path }"><b>{{this.$route.query.pathName}}</b></el-breadcrumb-item>
        <el-breadcrumb-item>阅读文章</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col>
      <!-- 加入v-if 进行判断 防止在数据未加载完时因找不到字段而报错 -->
      <article class="detail-page"  ref='container'>

        <section class="author-info">
          <img class="avatar" :src="defaultImg" width="36" height="36" />
          <div class="info">
            <p>
              <span class="name">From ： {{detail.author}}</span>
              <span class="visit-count">浏览量 ： {{detail.click}}</span>
            </p>
            <p>
              <time>发布于 {{detail.createTime }}</time>
            </p>
          </div>
        </section>
        <h2>文章正文</h2>
        <!-- 文章的内容是HTML格式的   所以使用v-html -->
        <section class="detail-content markdown-body" v-html="detail.content">

        </section>
        <comment :articleId="detail.articleId" :comments="commentData" @search="search"></comment>

      </article>
    </el-col>
  </el-row>
</template>

<script>
  import {bus} from '../../bus.js'
  import comment from '../../components/comment/comment'
  import COMMENT_API from '../../api/api_comment'
  export default {
    name: "ViewArticle",
    components: {
      comment
    },
    data() {
      return {
        defaultImg: require('../../assets/images/henu.jpg'),
        commentData: [],
        detail: {}
      }
    },
    created() {
    },
    mounted() {
      let that = this;
      that.detail=JSON.parse(localStorage.getItem("detailsForView"));
      that.search();
    },
    destroyed() {
      localStorage.removeItem("detailsForView")
    },
    methods:{
      search() {
        let that = this;
        COMMENT_API.findList({articleId: that.detail.articleId})
          .then(
            function (result) {
              console.log("result为："+result)
              if (result && result.data) {
                that.commentData = result.data;
              }
            },
            function (err) {
              that.$message.error({
                showClose: true,
                message: "获取评论失败",
                duration: 2000
              });
            }).catch(function (error) {
                that.loading = false;
                console.log(error);
                that.$message.error({
                  showClose: true,
                  message: "请求出现异常",
                  duration: 2000
                });
              });
      }
    }
  }

</script>

<style lang="scss">
  @import "../../assets/scss/common.scss";

  .detail-page{
    height: 100%;
    background-color: $white;

    .author-info{
      margin-bottom: $padding;
      padding: $padding;
      border-bottom: 1px solid #dddddd;
      display: flex;

      img{
        @extend .author-img;
        margin-right: $margin10;
      }

      .info{
        flex: 1;

        p{
          color: $text;
          font-size: $font-info;
          line-height: $authorImg/2;
          display: flex;

          .name,time{
            flex: 1;
          }

          time{
            text-align: right;
          }
        }
      }
    }
  }

  .detail-content{
    margin-bottom: $padding;
    padding: $padding;
    border-bottom: 1px solid #dddddd;
  }

  .addreply{
    width: 100%;
    padding: 0 $padding $padding;
    border-bottom: 1px solid #dddddd;

    el-button{
      display: inline-block;
      @extend .button;
      font-size: 14px;
      margin-left: 20px;
    }
  }

  .detail-replies{

    h2{
      padding:$padding;
      border-bottom: 1px solid #dddddd;
    }
    .replies-item{

      &:not(:last-child){
        border-bottom: 1px solid #dddddd;
      }

      .fa,.up-count{
        width: $authorImg/2;
        height: $authorImg/2;
        margin-left: $margin10;
        text-align: center;
        line-height: $authorImg/2;
      }

      .hasuped{
        color: $color42b;
      }
      .reply-content{
        padding: 0 $padding;
      }
    }
  }

  .reply-input,.commit-input{
    padding-top: 0 $padding-top;
    padding-left: 0 $padding-left;
    margin-bottom: $margin10;

    textarea{
      width: 100%;
      height: 60px;
      padding: 5px;
      border-radius: $radius;
    }

    button{
      @extend .button;
    }
  }
</style>
