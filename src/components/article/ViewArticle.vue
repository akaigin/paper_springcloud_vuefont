<template>
  <el-row class="wrap">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item v-if="this.$route.query.isJump === '1'" :to="{ path: this.$route.query.path }"><b>{{this.$route.query.pathName}}</b></el-breadcrumb-item>
        <el-breadcrumb-item>阅读文章</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <div v-html='content'></div>
    </el-col>
  </el-row>
</template>

<script>
    export default {
        name: "ViewArticle",
      data() {
        return {
          content: '',
          loading: false
        }
      },
      mounted() {
        let that=this;
        that.content=that.$route.query.content
      }
    }

</script>

<style scoped>

</style>
