<template>
  <el-form ref="AccountFrom" :model="account" :rules="rules" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
    <h3 class="title">管理员登录</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="account.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="pwd">
      <el-input type="password" v-model="account.pwd" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin" :loading="loading">登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import API from "../api/api_user";

  export default {
    data() {
      return {
        loading: false,
        account: {
          username: "admin",
          pwd: "123456"
        },
        rules: {
          username: [
            {required: true, message: "请输入账号", trigger: "blur"}
            //{ validator: validaePass }
          ],
          pwd: [
            {required: true, message: "请输入密码", trigger: "blur"}
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleLogin() {
        let that = this;
        this.$refs.AccountFrom.validate(valid => {
          if (valid) {
            this.loading = true;
            let loginParams = new FormData();
            loginParams.append('client_id', 'app');
            loginParams.append('client_secret', '123456');
            loginParams.append('grant_type', 'password');
            loginParams.append('username', this.account.username);
            loginParams.append('password', this.account.pwd);
            ;
            API.login(loginParams)
              .then(
                function (result) {
                  that.loading = false;
                  if (result) {
                    // localStorage.setItem(
                    //   "access-user",
                    //   JSON.stringify(result.user)
                    // );
                    localStorage.setItem("access-token", "bearer " + result.access_token);
                    localStorage.setItem("currentUser", "bearer " + result.access_token);
                    localStorage.setItem("currentPwd", that.account.pwd);
                    console.log(result.router)
                    localStorage.setItem("menus", JSON.stringify(result.router));
                    localStorage.setItem("perms", JSON.stringify(result.perms));
                    // that.$store.commit("SET_ROUTERS", result.router);
                    // that.$router.addRoutes(that.$store.getters.addRouters);
                    //that.$router.addRoutes(result.router)
                    // that.$router.options.routes = that.$store.getters.routers;
                    that.$router.push({path: "/"});
                  } else {
                    that.$message.error({
                      showClose: true,
                      message: "用户名或密码错误，请重新输入！",
                      duration: 2000
                    });
                  }
                },
                function (err) {
                  that.loading = false;
                  that.$message.error({
                    showClose: true,
                    message: "用户名或密码错误，请重新输入！",
                    duration: 2000
                  });
                }
              )
              .catch(function (error) {
                that.loading = false;
                console.log(error);
                that.$message.error({
                  showClose: true,
                  message: "请求出现异常",
                  duration: 2000
                });
              });
          }
        });
      }
    }
  };
</script>
<style>
  body {
    background: #dfe9fb;
  }
</style>
<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 160px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    background: -ms-linear-gradient(top, #ace, #00c1de); /* IE 10 */
    background: -moz-linear-gradient(top, #ace, #00c1de); /*火狐*/
    background: -webkit-gradient(
        linear,
        0% 0%,
        0% 100%,
        from(#ace),
        to(#00c1de)
    ); /*谷歌*/
    background: -webkit-linear-gradient(
        top,
        #ace,
        #00c1de
    ); /*Safari5.1 Chrome 10+*/
    background: -o-linear-gradient(top, #ace, #00c1de); /*Opera 11.10+*/

    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }

    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
