<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>修改密码</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-form ref="form" :model="form" label-width="120px" :rules="formRules">
        <el-form-item label="原密码" prop="oldPwd">
          <el-input type="password" v-model="form.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="form.newPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPwd">
          <el-input type="password" v-model="form.confirmPwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleChangepwd">提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
  import API from '../../api/api_user'
  export default{
    data(){
      // <!--验证密码-->
      let validateOldPwd = (rule, value, callback) => {
        let that = this;
        if (value === "") {
          callback(new Error("请输入密码"))
        } else if(value !== that.pwd){
          callback(new Error("请确认密码输入是否正确"))
        }else{
          callback()
        }
      }
      // <!--验证新密码-->
      let validateNewPwd = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"))
        } else {
          if (this.form.confirmPwd !== "") {
            this.$refs.form.validateField("confirmPwd");
          }
          callback()
        }
      }
      // <!--二次验证密码-->
      let validateConfirmPwd = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.form.newPwd) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        pwd: '',
        form: {
          oldPwd: '',
          newPwd: '',
          confirmPwd: ''
        },
        formRules: {
          oldPwd: [{required: true,validator: validateOldPwd, trigger: 'blur'}],
          newPwd: [{required: true,validator: validateNewPwd, trigger: 'blur'}],
          confirmPwd: [{required: true,validator: validateConfirmPwd, trigger: 'blur'}]
      },
      }
    },
    mounted() {
      let that = this;
      let currentPwd = localStorage.getItem('currentPwd');
      console.log(currentPwd)
      that.pwd=currentPwd;
    },

    methods: {
      handleChangepwd() {
        let that = this;
        that.$refs.form.validate((valid) => {
          if (valid) {
            that.loading = true;
            let params = Object.assign({}, that.form);
            API.changePwd({password: params.newPwd}).then(function (result) {
              that.loading = false;
              if (result && result.code === 0) {
                //修改成功
                that.$message.success({showClose: true, message: '修改成功', duration: 2000});
              } else {
                that.$message.error({showClose: true, message: result.msg, duration: 2000});
              }
            }, function (err) {
              that.loading = false;
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }).catch(function (error) {
              that.loading = false;
              console.log(error);
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          }
        });
      }
    }
  }
</script>
