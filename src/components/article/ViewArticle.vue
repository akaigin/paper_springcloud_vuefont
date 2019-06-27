<template>
  <el-row class="wrap">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item v-if="this.$route.query.isJump === '1'" :to="{ path: this.$route.query.path }"><b>{{this.$route.query.pathName}}</b></el-breadcrumb-item>
        <el-breadcrumb-item>阅读文章</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
  <article>
    <section class="author-info">
      <div class="top-info">
        <p>
          <span class="name">{{detail.createUser}}</span>
          <span class="visit-count">浏览量 ： {{detail.click}}</span>
        </p>
        <p>
          <time>发布于 {{detail.createTime | formatDate}}</time>
        </p>
      </div>
    </section>
    <div v-html="detail.content"></div>
    <comment :comments="commentData" @search="search"></comment>
  </article>
  </el-row>

</template>

<script>
  import Vue from 'vue'
  import comment from '../../components/comment/comment'
  import gotop from '../common/gotop.vue'
  import * as util from '../../assets/js/utils'
  import COMMENT_API from '../../api/api_comment'

    export default {
        name: "ViewArticle",
      components: {
        comment
      },
      data() {
        return {
          commentData: [],
          detail: {},
          addComment: '',
          replyRows: [],
          content: '',
          loading: false,
          comments: [],
          replies: {},
          repliesContent: {
            accesstoken: window.localStorage.getItem('access-token'),
            content: '',
            reply_id: null
          }
        }
      },
      created() {
        let that = this;
        that.content=that.$route.query.content
        that.detail=that.$route.query;
        that.search();
      },
      mounted() {
        let that=this;
      },
      methods:{
        search() {
          let that = this;
          COMMENT_API.findList({articleId: that.$route.query.articleId}, that.$route.query.articleId)
            .then(
              function (result) {
                that.loading = false;
                if (result && result.page.rows) {
                  that.total = result.page.total;
                  that.commentData = result.page.rows;
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
        }
      }
    }

</script>

<style lang="scss">
  @import "../../assets/scss/common.scss";

  .detail-page{
    height: 100%;
    padding-top: 45px;
    overflow: scroll;
    background-color: $white;

  .author-info{
    padding: $padding;
    display: flex;

  img{
  @extend .author-img;
    margin-right: $margin10;
  }

  .top-info{
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
    overflow: scroll;
    margin-bottom: $padding;
    padding: $padding;
    border-bottom: 1px solid #dddddd;
  }

  .addreply{
    width: 100%;
    padding: 0 $padding $padding;
    border-bottom: 1px solid #dddddd;

  span{
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
    padding: 0 $padding;
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
