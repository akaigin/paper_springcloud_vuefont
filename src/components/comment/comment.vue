<!--评论模块-->
<template>
  <div class="container"><!--
    <article class="detail-page" v-if="detail.tab" ref='container' @scroll="targetScroll">
    <div class="addreply">
      <section class="commit-input">
        <textarea name="commit" placeholder="请输入评论"></textarea>
      </section>
      <span @click="addCommitOrReply('commit')">新增评论</span>
    </div>
    </article>-->
    <h2>评论区</h2>
    <div class="comment" v-for="item in comments">
      <div class="info">
        <img class="avatar" :src="item.fromAvatar" width="36" height="36"/>
        <div class="right">
          <div class="name">{{item.author}}</div>
          <div class="date">{{item.createTime}}</div>
        </div>
      </div>
      <div class="content">{{item.content}}</div>
      <div class="control">
        <span class="like" :class="{active: item.isLike}" @click="likeClick(item)">
          <i class="iconfont-comment icon-like"></i>
          <span class="like-num">{{item.likeNum > 0 ? item.likeNum + '人赞' : '赞'}}</span>
        </span>
        <span class="comment-reply" @click="showCommentInput(item)">
          <i class="iconfont-comment icon-comment"></i>
          <span>回复</span>
        </span>
      </div>
      <div class="reply">
        <div class="item" v-for="reply in item.replies">
          <div class="reply-content">
            <span class="from-name">{{reply.author}}</span><span>: </span>
            <span class="to-name">@{{reply.toWho}}</span>
            <span>{{reply.content}}</span>
          </div>
          <div class="reply-bottom">
            <span>{{reply.createTime}}</span>
            <span class="reply-text" @click="showCommentInput(item, reply)">
              <i class="iconfont icon-comment"></i>
              <span>回复</span>
            </span>
          </div>
        </div>
        <div class="write-reply" v-if="item.replies !== null" @click="showCommentInput(item)">
          <i class="el-icon-edit"></i>
          <span class="add-comment">添加新评论</span>
        </div>
        <transition name="fade">
          <div class="input-wrapper" v-if="showItemId === item.commentId">
            <el-input class="gray-bg-input"
                      v-model="inputComment"
                      type="textarea"
                      :rows="3"
                      autofocus
                      placeholder="写下你的评论">
            </el-input>
            <div class="btn-control">
              <span class="cancel" @click="cancel">取消</span>
              <el-button class="btn" type="success" round @click="commitComment">确定</el-button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>

  import Vue from 'vue'
  import COMMENT_API from '../../api/api_comment'
  import {bus} from "../../bus.js";

  export default {
    props: {
      comments: {
        type: Array,
        required: true
      }
    },
    components: {},
    data() {
      return {
        inputComment: '',
        showItemId: '',
        toWho: '',
        nickname: '',
        parentId: '',
      }
    },
    computed: {},
    methods: {
      /**
       * 点赞
       */
      likeClick(item) {
        if (item.isLike === null) {
          Vue.$set(item, "isLike", true);
          item.likeNum++
        } else {
          if (item.isLike) {
            item.likeNum--
          } else {
            item.likeNum++
          }
          item.isLike = !item.isLike;
        }

      },

      /**
       * 点击取消按钮
       */
      cancel() {
        let that = this;
        that.showItemId = ''
        that.inputComment = ''
        that.toWho= ''
        that.parentId= ''
      },

      /**
       * 提交评论
       */
      commitComment() {
        let that= this;
        let startIndex= that.inputComment.indexOf('@'+that.toWho) === -1? 0 : that.inputComment.indexOf('@'+that.toWho)+ that.toWho.length+1;
        let content = that.inputComment.substring(startIndex);
        let params={
          author: that.nickname,
          content: content,
          parentId: that.parentId,
          articleId: that.comments[0].articleId,
          toWho: that.toWho
        }
        COMMENT_API.save(params).then(res => {
          if(res.code === 0){
            that.$message.success({
              showClose: true,
              message: "回复成功",
              duration: 2000
            })
          }else {
            that.$message.error({
              showClose: true,
              message: "回复失败",
              duration: 2000
            })
          }
          that.$emit('search');
          that.cancel()
        })
      },

      /**
       * 点击评论按钮显示输入框
       * item: 当前大评论
       * reply: 当前回复的评论
       */
      showCommentInput(item, reply) {
        let that= this;
        that.parentId= item.commentId
        if (reply) {
          that.inputComment = "@" + reply.author + " "
          that.toWho= reply.author
        } else {
          that.inputComment = ''
          that.toWho= item.author
        }
        that.showItemId = item.commentId
      }
    },
    created() {
      let that= this;
      console.log(that.comments)
      bus.$on("setNickName", text => {
        this.nickname = text;
      });
    }
  }
</script>

<style scoped lang="scss">

  @import "../../assets/css/scss";
  @import '../../assets/iconfont-comment.css';
  .container {
    padding: 0 10px;
    box-sizing: border-box;
    .comment {
      display: flex;
      flex-direction: column;
      padding: 10px;
      border-bottom: 1px solid $border-fourth;
      .info {
        display: flex;
        align-items: center;
        .avatar {
          border-radius: 50%;
        }
        .right {
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          .name {
            font-size: 16px;
            color: $text-main;
            margin-bottom: 5px;
            font-weight: 500;
          }
          .date {
            font-size: 12px;
            color: $text-minor;
          }
        }
      }
      .content {
        font-size: 16px;
        color: $text-main;
        line-height: 20px;
        padding: 10px 0;
      }
      .control {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: $text-minor;
        .like {
          display: flex;
          align-items: center;
          margin-right: 20px;
          cursor: pointer;
          &.active, &:hover {
            color: $color-main;
          }
          .iconfont {
            font-size: 14px;
            margin-right: 5px;
          }
        }
        .comment-reply {
          display: flex;
          align-items: center;
          cursor: pointer;
          &:hover {
            color: $text-333;
          }
          .iconfont {
            font-size: 16px;
            margin-right: 5px;
          }
        }

      }
      .reply {
        margin: 10px 0;
        border-left: 2px solid $border-first;
        .item {
          margin: 0 10px;
          padding: 10px 0;
          border-bottom: 1px dashed $border-third;
          .reply-content {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: $text-main;
            .from-name {
              color: $color-main;
            }
            .to-name {
              color: $color-main;
              margin-left: 5px;
              margin-right: 5px;
            }
          }
          .reply-bottom {
            display: flex;
            align-items: center;
            margin-top: 6px;
            font-size: 12px;
            color: $text-minor;
            .reply-text {
              display: flex;
              align-items: center;
              margin-left: 10px;
              cursor: pointer;
              &:hover {
                color: $text-333;
              }
              .icon-comment {
                margin-right: 5px;
              }
            }
          }
        }
        .write-reply {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: $text-minor;
          padding: 10px;
          cursor: pointer;
          &:hover {
            color: $text-main;
          }
          .el-icon-edit {
            margin-right: 5px;
          }
        }
        .fade-enter-active, fade-leave-active {
          transition: opacity 0.5s;
        }
        .fade-enter, .fade-leave-to {
          opacity: 0;
        }
        .input-wrapper {
          padding: 10px;
          .gray-bg-input, .el-input__inner {
            /*background-color: #67C23A;*/
          }
          .btn-control {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-top: 10px;
            .cancel {
              font-size: 16px;
              color: $text-normal;
              margin-right: 20px;
              cursor: pointer;
              &:hover {
                color: $text-333;
              }
            }
            .confirm {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
</style>
